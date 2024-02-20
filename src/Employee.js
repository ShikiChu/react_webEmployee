import React,{Component} from "react";
import {Variable} from "./Variable";

export default class Employee extends Component{

    constructor (props) {
        super(props);

        // employee data from api into array
        this.state={
            departments:[],
            employees:[],
            modalTitle : "",
            EmployeeId : 0,
            EmployeeName:"",
            JoinDate:"",
            Department:"",
            PhotoFileName:"default.jpg",
            PhotoPath:Variable.PHOTO_URL,
            showAlert: false 

            // filter
            
        }
    }

    // Method to fetch department data from the API
    apiGetEmpList() {
        fetch(Variable.API_URL + 'employee')
        .then(response => response.json())
        .then(data => {
            // Update state with fetched data
            this.setState({ employees: data });
        })
        .catch(error => {
            console.error('Error fetching emp data:', error);
        });
    }

    apiGetList() {
        fetch(Variable.API_URL + 'department')
        .then(response => response.json())
        .then(data => {
            // Update state with fetched data
            this.setState({ departments: data });
        })
        .catch(error => {
            console.error('Error fetching department data:', error);
        });
    }

    // Lifecycle method: called after the component is mounted
    componentDidMount(){
        this.apiGetEmpList();
        this.apiGetList();
    }
    // post api to create new record
    createEmployee() {
        fetch(Variable.API_URL + 'employee', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeName: this.state.EmployeeName,
                Department:this.state.Department,
                JoinDate:this.state.JoinDate,
                PhotoFileName:this.state.PhotoFileName
            })
        })
        .then(res => res.json()) 
        .then((result) => {
            console.log(result);
            this.apiGetList();
            this.apiGetEmpList();
        })
        .catch(error => {
            console.log('Error Msg:', error);
        })
    }

    // put api to update the record
    updateEmployee() {
        fetch(Variable.API_URL + 'employee', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeId: this.state.EmployeeId,
                EmployeeName: this.state.EmployeeName,
                Department:this.state.Department,
                JoinDate:this.state.JoinDate,
                PhotoFileName:this.state.PhotoFileName
            })
        })
        .then(res => res.json()) 
        .then((result) => {
            console.log(result);
            this.apiGetList();
            this.apiGetEmpList();

             // Show the alert when update is successful
             this.setState({ showAlert: true });
             // Hide the alert after some time (e.g., 3 seconds)
             setTimeout(() => {
                 this.setState({ showAlert: false });
             }, 3000);
        })
        .catch(error => {
            console.log('Error Msg:', error);
        })
    }

    deleteEmployee(id) {
        if(window.confirm('Are you sure to delete this record?')){
            fetch(Variable.API_URL + 'employee/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json()) 
            .then((result) => {
                console.log(result);
                this.apiGetList();
                this.apiGetEmpList();
            })
            .catch(error => {
                console.log('Error Msg:', error);
            })

        }
        
    }
    
    changeEmployeeName = (e) =>{
        this.setState({EmployeeName:e.target.value})
    }

    changeDepartment = (e) =>{
        this.setState({Department:e.target.value})
    }

    changeJoinDate = (e) =>{
        this.setState({JoinDate:e.target.value})
    }

    addClick = () =>{
        this.setState({
            modalTitle:"Add New Employee",
            EmployeeId:0,
            EmployeeName:"",
            Department:"",
            JoinDate:"",
            PhotoFileName:"default.jpg",
        })
    }

    editClick = (emp) => {
        this.setState({
            modalTitle: "Edit Department",
            EmployeeId:emp.employeeId,
            EmployeeName: emp.employeeName,
            Department:emp.department,
            JoinDate:emp.joinDate,
            PhotoFileName:emp.photoFileName
        });
    }

    uploadImg = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
    
        fetch(Variable.API_URL + 'employee/UploadPhoto', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to upload image');
            }
            return res.json();
        })
        .then(data => {
            this.setState({ PhotoFileName: data });
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            // Handle error, such as displaying a message to the user
        });
    }
    
    render() {
        const { showAlert } = this.state;
        const { departments, modalTitle, employees, EmployeeId,EmployeeName,JoinDate, PhotoFileName, PhotoPath,Department} = this.state;
        return(
            <div>
                
                <h2>Employee List</h2>
                {/* button to trigger modal */}
                <button
                type="button" 
                className="btn btn-outline-primary float-right mb-2" 
                data-toggle="modal" 
                data-target="#exampleModal"
                onClick={this.addClick}>Add Employee</button>


                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">Employee Id</th>
                        <th scope="col">Employee Name</th>
                        <th scope="col">Department</th>
                        <th scope="col">Join Date</th>
                        <th scope="col">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp=>
                        <tr key={emp.employeeId}>
                            <td>
                                {emp.employeeId}
                            </td>
                            <td>
                                {emp.employeeName}
                            </td>
                            <td>
                                {emp.department}
                            </td>
                            <td>
                                {emp.joinDate.slice(0, 10)}
                            </td>
                            <td>
                                {/* button to trigger modal   */}
                                <button type="button" 
                                className="btn btn-light md-1" 
                                data-toggle="modal" 
                                data-target="#exampleModal"
                                onClick={() => this.editClick(emp)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>
                                <button type="button" className="btn btn-light md-1" onClick={()=>this.deleteEmployee(emp.employeeId)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                                </button>
                            </td>

                        </tr>
                        )}
                    </tbody>
                </table>


                {/* modal */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        
                        {/* update successfully msg */}
                        {showAlert && (
                            <div className="alert alert-success" role="alert">
                                Employee details updated successfully!
                            </div>
                        )}
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text">Name:</span>
                                <input type='text' className="form-control" value={EmployeeName} onChange={this.changeEmployeeName} />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">Department:</span>
                                <select className="form-select form-control" 
                                        onChange={this.changeDepartment}
                                        value={Department}>
                                    <option defaultValue>Choose...</option>
                                    {departments.map(dep => (
                                        <option key={dep.departmentId}>{dep.departmentName}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="input-group mb-3">
                                <span className="input-group-text">Join Date:</span>
                                <input type='date' className="form-control" value={JoinDate.slice(0, 10)} onChange={this.changeJoinDate} />
                            </div>
                            
                            {/* show the photo from path */}
                            <div>
                                <img width="250px" height="250px" 
                                    src={PhotoPath + PhotoFileName} alt={PhotoFileName} />
                                <input type="file" className="m-2" onChange={this.uploadImg}/>
                            </div>

                            {/* check insert or update */}
                            {EmployeeId === 0 ?
                            <button 
                            type="button" 
                            className="btn btn-outline-primary float-left"
                            onClick={()=>this.createEmployee()}
                            >Create</button> : null
                            }
                            {EmployeeId !== 0 ?

                            <button type="button" 
                            className="btn btn-outline-primary float-left"
                            onClick={()=>this.updateEmployee()}>Save changes</button> : null
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}