import {useEffect, useState} from 'react'
import axios from 'axios'
import { Viewer, ProgressBar } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function Home() {
  const [blobURL, setBlobURL] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [validation, setValidation] = useState('');
  const [reportErr, setReportErr] = useState(false);
  const [title, setTitle] = useState('');
  const [defaultFormValue, setDefaultFormValue] = useState('');

  /* useEffect(() => {
    
  }, []) */

  const validator = (elements) => {
    const {
      title,
      param_faculty,
      param_department
    } = elements;

    let validation = '';
    if (!title || title.value === '') validation += 'Title, ';
    if (!param_faculty || param_faculty.value === '') validation += 'Faculty, ';
    if (!param_department || param_department.value === '') validation += 'Department, ';

    if (validation === '') {
      return '';
    } else {
      return validation + 'is required';
    }
  }

  const getReport = (e) => {
    e.preventDefault();

    const {
      title,
      param_faculty,
      param_department
    } = e.target.elements;

    const validation = validator(e.target.elements);
    setValidation(validation);
    
    if (validation === '') {
      axios.post('/api/get-report', {
        title: title.value,
        param_faculty: param_faculty.value,
        param_department: param_department.value
      }, {
        responseType: 'blob'
      })
      .then(res => {
        console.log('res: ', res);
        setShowReport(true);
        setValidation('');
        setTitle(title.value);
  
        const blob = new Blob(
          [res.data], 
          {
            type: 'application/pdf'
          }
        );
        const imgUrl = URL.createObjectURL(blob);
        setBlobURL(imgUrl)
      })
      .catch(({response}) => {
        console.log('err: ', response);
        setReportErr(true);
      });
    }
  }

  return (
    <>
      {
        showReport
        ? 
          blobURL
          ? <div className="mx-auto">
              <div className="flex justify-between items-center px-3">
                <h3 className="text-gray-600 text-md font-medium">{title}</h3>
                <button 
                  type="submit" 
                  className="w-32 text-center px-3 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:bg-gray-900 mt-3"
                  style={{
                    marginLeft: '10px',
                    marginBottom: '12px'
                  }}
                  onClick={() => {
                    setShowReport(false);
                  }}>
                  Back
                </button>
              </div>
              <div className="flex">
                <div className="w-full">
                  <div
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      height: 'calc(100vh - 60px)',
                    }}
                  >
                    <Viewer 
                      renderLoader={(percentages) => (
                        <div style={{ width: '240px' }}>
                          <ProgressBar progress={Math.round(percentages)} />
                        </div>
                      )} 
                      plugins={[defaultLayoutPluginInstance]}
                      fileUrl={blobURL}
                    />
                  </div>
                </div>
              </div>
            </div>
          : "Loading Report.."
        : <div className="container flex justify-center items-center px-6" style={{height: '100vh'}}>
            <div className="w-full max-w-2xl">
              <h3 className="text-gray-600 mb-12 text-center text-2xl font-medium">Jasper Report Viewer</h3>
              {reportErr && <p className="text-sm text-red-500 ">Fetching report have got issue. Please check report title and parameters again.</p>}
              <form onSubmit={getReport}>
                <div className="mt-4 flex">
                  <label className="block w-full">
                    <input type="text" className="block w-full bg-white rounded-md border p-2 focus:outline-none" placeholder="Report Title" name="title" defaultValue={defaultFormValue} />
                    {validation.includes('Title') && <p className="text-sm text-red-500 ">Title is required</p>}
                  </label>
                </div>
                <div className="mt-4 mb-1 grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <label className="block">
                    <input type="text" className="block w-full bg-white rounded-md border p-2 focus:outline-none" placeholder="Faculty" name="param_faculty" defaultValue={defaultFormValue} />
                    {validation.includes('Faculty') && <p className="text-sm text-red-500 ">Faculty is required</p>}
                  </label>
                  <label className="block">
                    <input type="text" className="block w-full bg-white rounded-md border p-2 focus:outline-none" placeholder="Department" name="param_department" defaultValue={defaultFormValue} />
                    {validation.includes('Department') && <p className="text-sm text-red-500 ">Department is required</p>}
                  </label>
                </div>                      
                <button type="submit" className="w-full text-center px-3 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:bg-gray-900 mt-3">
                  View
                </button>
              </form>
            </div>
          </div>
      }
    </>
  )

}
