import React from 'react';
import PouchDB from 'pouchdb';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CSVImporter extends React.Component {
  constructor(props) {
    super(props);

    // Initialize the PouchDB database
    this.db = new PouchDB('my-csv-db');
  }
  onChangePack(state) {
    // Get the uploaded file
    const file = state.target.files[0];

    // Read the contents of the file as a text string
    const reader = new FileReader();
    reader.onload = (state) => {
      const csvData = state.target.result;
      console.log(csvData);

      // Parse the CSV data into an array of objects
      const { data, errors } = Papa.parse(csvData, {});
      if (errors.length > 0) {
        console.error(errors);
        return;
      }

      console.log({ data })

      // Insert the CSV data into the PouchDB database
      this.db
        .bulkDocs(data)
        .then(() => {
          console.log('CSV data saved to database');
        })
        .catch((err) => {
          console.error(err);
        });
    };
    reader.readAsText(file);
  }
    


  handleFileUpload(event) {
    // Get the uploaded file
    const file = event.target.files[0];

    // Read the contents of the file as a text string
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      console.log(csvData)
      // Parse the CSV data into an array of objects
      const { data, errors } = Papa.parse(csvData, {});
      if (errors.length > 0) {
        console.error(errors);
        return;
      }

      console.log({ data })

      // Insert the CSV data into the PouchDB database
      this.db
        .bulkDocs(data)
        .then(() => {
          console.log('CSV data saved to database');
        })
        .catch((err) => {
          console.error(err);
        });
    };
    reader.readAsText(file);
  }

  handleDownloadCSV() {
    // Retrieve all documents from the PouchDB database
    this.db
      .allDocs({ include_docs: true })
      .then((docs) => {
        // Map the documents to an array of objects
        const data = docs.rows.map((row) => row.doc);

        // Convert the data to a CSV string
        const csvString = Papa.unparse(data);

        // Create a Blob from the CSV string
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

        // Save the Blob as a file using the FileSaver library
        saveAs(blob, 'data.csv');
      })
      .catch((err) => {
        console.error(err);
      });
  }
  handleReadData() {
    // Retrieve all documents from the PouchDB database
    this.db
      .allDocs({ include_docs: true })
      .then((docs) => {
        // Map the documents to an array of objects
        const data = docs.rows.map((row) => row.doc);
        console.log('CSV data retrieved from database:', data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  handleDeleteData() {
    // Retrieve all documents from the PouchDB database
    this.db
      .allDocs({ include_docs: true })
      .then((docs) => {
        // Delete each document from the database
        const docsToDelete = docs.rows.map((row) => {
          row.doc._deleted = true;
          return row.doc;
        });

        return this.db.bulkDocs(docsToDelete);
      })
      .then(() => {
        console.log('CSV data deleted from database');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleUpdateData() {
    // Retrieve all documents from the PouchDB database
    this.db
      .allDocs({ include_docs: true })
      .then((docs) => {
        // Update each document in the database
        const docsToUpdate = docs.rows.map((row) => {
          row.doc.updatedAt = new Date();
          return row.doc;
        });

        return this.db.bulkDocs(docsToUpdate);
      })
      .then(() => {
        console.log('CSV data updated in database');
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    return (
      <div>
        <input type="file" onChange={this.onChangePack.bind(this)} />
        <button onClick={this.handleDownloadCSV.bind(this)} className="btn btn-primary">
          Download CSV
        </button>
        <button onClick={() => this.fileInput.click()} className="btn btn-primary">
          Import CSV
        </button>
        <input
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          ref={(fileInput) => (this.fileInput = fileInput)}
          onChange={this.handleFileUpload.bind(this)}
          className="btn btn-primary"
        />
        <button onClick={this.handleReadData.bind(this)} className="btn btn-primary">
          Read Data
        </button>
        <button onClick={this.handleUpdateData.bind(this)} className="btn btn-primary">
          Update Data
        </button>
        <button onClick={this.handleDeleteData.bind(this)} className="btn btn-primary">
          Delete Data
        </button>
      </div>
    );
  }
}
