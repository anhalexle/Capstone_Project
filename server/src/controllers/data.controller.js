const fs = require('fs');

const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const moment = require('moment-timezone');

const CRUDFactory = require('./factory.controller');
const Data = require('../models/data.model');

const catchAsync = require('../utils/catchAsync.util');
const getDataFromYearFunc = require('../utils/getDataFromYear.util');
const convertTotalIntegralToMoney = require('../utils/bill.util');
const AppError = require('../utils/appError.util');
const getDatesBetween = require('../utils/getDates.util');
const totalPowerOneDay = require('../utils/totalOneDay.util');
const totalIntegralOneDayAPI = require('../utils/totalIntegralOneDayAPI.util');

// const createPipeLine = (date, name) => {
//   let theDate;
//   let nextDate;
//   const pipeline = [
//     { $match: { name } },
//     {
//       $project: {
//         _id: 0,
//         value: 1,
//         createdAt: 1,
//       },
//     },
//   ];
//   if (date.day && date.month && date.year) {
//     theDate = new Date(date.year, date.month - 1, date.day, 7, 0);
//     nextDate = new Date(date.year, date.month - 1, date.day + 1, 7, 0);
//   } else if (date.month && date.year) {
//     theDate = new Date(date.year, date.month - 1, 1, 7, 0);
//     nextDate = new Date(date.year, date.month, 1, 7, 0);
//   } else {
//     theDate = new Date(date.year, 0, 1, 7, 0);
//     nextDate = new Date(date.year + 1, 0, 1, 7, 0);
//   }
//   console.log(theDate, nextDate);
//   pipeline.unshift({
//     $match: {
//       createdAt: {
//         $gte: theDate,
//         $lt: nextDate,
//       },
//     },
//   });
//   return pipeline;
// };

const readTemplateExcelFile = async (data, sheet = 'Sheet1') => {
  const templateFile = `${global.__basedir}\\src\\dev-data\\data\\template.xlsx`;
  const buffer = fs.readFileSync(templateFile);
  // create a new workbook from the template file buffer
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(sheet);

  worksheet.getCell('A2').value = 'Từ: 28/2 - Đến: 4/3';
  data.forEach((el, index) => {
    const rowNumber = index + 4;
    worksheet.getCell(`A${rowNumber}`).value = index + 1;
    worksheet.getCell(`B${rowNumber}`).value = el.name;
    worksheet.getCell(`C${rowNumber}`).value = el.type;
    worksheet.getCell(`D${rowNumber}`).value = el.value;
    worksheet.getCell(`E${rowNumber}`).value = new Date(
      el.createdAt
    ).toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
  });
  return await workbook.xlsx.writeBuffer();
};

exports.getAllDataFromSocket = (req, res, next) => {
  global._io.emit('send-me-data', 'hello');
  res.status(200).json({ status: 'Success' });
};

exports.getAllData = new CRUDFactory(Data).getAll();

// exports.calcElectricBill = catchAsync(async (req, res, next) => {
//   const { month, type } = req.body;
//   const year = new Date(Date.now()).getFullYear();
//   const date = { month, year };
//   const aggPipeline = createPipeLine(date, 'integral_power');
//   const allData = await Data.aggregate(aggPipeline);
// });

// exports.drawChart = catchAsync(async (req, res, next) => {
//   const { date, name } = req.body;
//   console.log(date, name);
//   if (!date) return next(new AppError('Please provide date', 404));
//   const aggPipeline = createPipeLine(date, name);
//   const allData = await Data.aggregate(aggPipeline);
//   return res.status(201).json({
//     status: 'success',
//     data: allData.length > 0 ? allData : null,
//   });
// });

const createPipeLine = (startDate, endDate, name) => {
  const pipeline = [
    {
      $match: { name },
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
  ];
  return pipeline;
};
exports.drawChart = catchAsync(async (req, res, next) => {
  const { startDate, endDate, name } = req.body;
  // console.log(startDate, endDate);
  if (!startDate || !endDate)
    return next(new AppError('Please provide date', 404));
  if (!name) return next(new AppError('Please provide name', 404));
  const aggPipeline = createPipeLine(startDate, endDate, name);
  const allData = await Data.aggregate(aggPipeline);
  return res.status(201).json({
    status: 'success',
    data: allData.length > 0 ? allData : null,
  });
});

exports.exportExcel = catchAsync(async (req, res, next) => {
  // get the worksheet from the workbook
  const now = new Date();
  const data = await Data.find({ type: 'volt' }).sort({ createdAt: 1 });
  const output = await readTemplateExcelFile(data);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=report-${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}.xlsx`
  );

  // send the Excel file to the client
  res.send(output);
});

exports.exportPDF = catchAsync(async (req, res, next) => {
  const doc = new PDFDocument();
  const fileName = 'firstPDF.pdf';
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename = ${fileName}`);
  doc.pipe(res);
  doc.fontSize(16).text('Hello from the server');
  doc.end();
});

exports.getDataFromDay = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  console.log(startDate, endDate);
  const tempStartDate = new Date(startDate);
  const tempEndDate = new Date(endDate);

  // chuyển đổi đối tượng moment sang Date object
  const ISOstartDate = new Date(
    tempStartDate.getFullYear(),
    tempStartDate.getMonth(),
    tempStartDate.getDate(),
    7,
    0,
    0
  );
  const ISOendDate = new Date(
    tempEndDate.getFullYear(),
    tempEndDate.getMonth(),
    tempEndDate.getDate(),
    7,
    0,
    0
  );
  console.log(ISOstartDate, ISOendDate);
  const dates = getDatesBetween(ISOstartDate, ISOendDate);
  console.log(dates);
  const promises = dates.map(async (el) => {
    const data = await totalIntegralOneDayAPI(el.rawDate);
    return {
      Date: el.VNDate,
      Peak: data[2] ? data[2].totalPower : 0,
      Normal: data[1] ? data[1].totalPower : 0,
      OffPeak: data[0] ? data[0].totalPower : 0,
    };
  });
  const data = await Promise.all(promises);
  console.log(data);
  res.status(200).json({ status: 'success', data: { data } });
});

exports.getDataFromYear = catchAsync(async (req, res, next) => {
  const { year, monthRequired } = req.query;
  let month;
  const now = new Date();
  if (monthRequired) {
    month = monthRequired < 10 ? `0${monthRequired}` : `${monthRequired}`;
  } else {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 12, 7, 0, 0);
    const future = new Date(now.getFullYear(), now.getMonth(), 11, 7, 0, 0);
    month = now.getMonth();
    if (prev <= now <= future) {
      month += 1;
    }
    month = month < 10 ? `0${month}` : `${month}`;
  }
  // console.log(month, year);
  const dataLastYear = await getDataFromYearFunc(
    new Date(`${year - 1}-12-01`),
    new Date(`${year - 1}-01-01`)
  );
  let dataThisYear;
  if (year * 1 === now.getFullYear() * 1) {
    dataThisYear = await getDataFromYearFunc(
      new Date(`${year}-${month}-01`),
      new Date(`${year}-01-01`)
    );
  } else {
    dataThisYear = await getDataFromYearFunc(
      new Date(`${year}-12-01`),
      new Date(`${year}-01-01`)
    );
  }
  console.log({ dataThisYear, month });
  const result = dataLastYear.map((el) => {
    let ThisYear;
    const data = dataThisYear.find((value) => value.Month === el.Month);
    if (!data) ThisYear = 0;
    else ThisYear = data.TotalPower;
    el.ThisYear = ThisYear;
    el.LastYear = el.TotalPower;
    el.Year = year;
    delete el.TotalPower;
    return el;
  });
  const totalMoney = JSON.parse(JSON.stringify(result));
  convertTotalIntegralToMoney(totalMoney, 1);
  if (monthRequired) {
    result.map((el) => {
      el.LastYear = Object.values(el.LastYear).reduce(
        (acc, val) => acc + val,
        0
      );
      return el;
    });
    totalMoney.map((el) => {
      el.LastYear = Object.values(el.LastYear).reduce(
        (acc, val) => acc + val,
        0
      );
      return el;
    });
  }
  console.log({ result, totalMoney });
  res.status(200).json({
    status: 'success',
    type: 1,
    data: { result, totalMoney },
  });
});
