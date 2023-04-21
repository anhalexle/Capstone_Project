import { useContext } from 'react';
import multiContext from '../src/multiContext';

const useMultiContext = () => {
  return useContext(multiContext);
};

export default useMultiContext;
