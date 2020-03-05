import React, { useState, useEffect } from "react";
import axios from "axios";

export const List = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    await axios.get(`/list`).then(result => {
      console.log("result", result);
      setLists(result.data);
      setLoading(false);
    });
  };

  const tableData = () => {
    return lists.map((list, i) => {
      const { name, id } = list;
      return (
        <tr key={id} className="text-left">
          <td>{i + 1}</td>
          <td onClick={() => clicka(list)}>{name}</td>
          <td>
            <small>delete</small>
          </td>
        </tr>
      );
    });
  };

  const clicka = async (list) => {
    // console.log("specific list", list);
    // const blob = new Blob([list], { type: 'application/pdf' });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a')
    // // a.setAttribute('hidden', '');
    // a.setAttribute('href', url);
    // a.setAttribute('download', `${list.name}`);
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a)

    // let promise = new Promise((resolve,reject) => {

    //   resolve( axios.get(`/download/${list.id}/${list.name}`))
    // })

    // let serverResponse = await promise; 

    // const url = window.URL.createObjectURL(new  Blob([serverResponse]))
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'file.pdf'); //or any other extension
    //     document.body.appendChild(link);
    //     link.click();


    
    // var FileSaver = require('file-saver');
   await axios.get(`/download/${list.id}/${list.name}`
    // , {
    //   responseType: 'blob',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/pdf'
    //   }}
    )
  //   .then((response) => {
  //     const url = window.URL.createObjectURL(new  Blob(response.data))
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'file.pdf'); //or any other extension
  //     document.body.appendChild(link);
  //     link.click();
  // })
    .then(response => {
      console.log("object::::::", response)
      // const url = window.URL.createObjectURL(new Blob([response]))
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `${list.name}`);
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link)
      // console.log("object", response)
    })
    // .then(blob => {
    //   const url = window.URL.createObjectURL(new Blob([blob]))
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute('download', `${list.name}`);
    //   document.body.appendChild(link);
    //   link.click();
    //   link.parentNode.removeChild(link)
    // })
    .catch(e => console.log("error", e))
  };

  const download = data => {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
  }
  

  return (
    <table>
      <thead>
        {loading ? (
          <tr>
            <td colSpan="3">Loading...</td>
          </tr>
        ) : (
          <tr>
            <td>S/N</td>
            <td>File</td>
            <td>Actions</td>
          </tr>
        )}
      </thead>
      <tbody>{tableData()}</tbody>
    </table>
  );
};
