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
          <td onClick={() => downloadFile(list)}>{name}</td>
          <td>
            <button>
              <small onClick={() => deleteFile(list)}>delete</small>
            </button>
          </td>
        </tr>
      );
    });
  };

  const downloadFile = async (list) => {
   await axios.get(`/download/${list.id}/${list.name}`)
   .then(response => {
  console.log("object", response)    
  })
 .catch(e => console.log("error", e))
  };

  const deleteFile = async (list) => {
    await axios.delete(`/delete/${list.id}`)
    .then(response => {
      console.log("object from delete", response)    
      })
     .catch(e => console.log("error::::::::", e))
  }


  // const download = data => {
  //   const blob = new Blob([data], { type: 'application/pdf' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a')
  //   a.setAttribute('hidden', '');
  //   a.setAttribute('href', url);
  //   a.setAttribute('download', 'download');
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a)
  // }
  

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
