const fs = require('fs');

const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const CRUDFactory = require('./factory.controller');
const Data = require('../models/data.model');
const catchAsync = require('../utils/catchAsync.util');
const AppError = require('../utils/appError.util');
const getDatesBetween = require('../utils/getDates.util');
const totalPowerOneDay = require('../utils/totalOneDay.util');

const createPipeLine = (date, name) => {
  let theDate;
  let nextDate;
  const pipeline = [
    { $match: { name } },
    {
      $project: {
        _id: 0,
        value: 1,
        createdAt: 1,
      },
    },
  ];
  if (date.day && date.month && date.year) {
    theDate = new Date(date.year, date.month - 1, date.day, 7, 0);
    nextDate = new Date(date.year, date.month - 1, date.day + 1, 7, 0);
  } else if (date.month && date.year) {
    theDate = new Date(date.year, date.month - 1, 1, 7, 0);
    nextDate = new Date(date.year, date.month, 1, 7, 0);
  } else {
    theDate = new Date(date.year, 0, 1, 7, 0);
    nextDate = new Date(date.year + 1, 0, 1, 7, 0);
  }
  console.log(theDate, nextDate);
  pipeline.unshift({
    $match: {
      createdAt: {
        $gte: theDate,
        $lt: nextDate,
      },
    },
  });
  return pipeline;
};

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

exports.drawChart = catchAsync(async (req, res, next) => {
  const { date, name } = req.body;
  if (!date) return next(new AppError('Please provide date', 404));
  const aggPipeline = createPipeLine(date, name);
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
  const ISOstartDate = new Date(startDate);
  const ISOendDate = new Date(endDate);
  const dates = getDatesBetween(ISOstartDate, ISOendDate);
  const promises = dates.map(async (date) => {
    const data = await totalPowerOneDay(date);
    return {
      Date: date.toLocaleString().split(',')[0],
      Peak: data[2] ? data[2].totalPower : 0,
      Normal: data[1] ? data[1].totalPower : 0,
      OffPeak: data[0] ? data[0].totalPower : 0,
    };
  });
  const result = await Promise.all(promises);
  res.status(200).json({ status: 'success', data: { result } });
});
