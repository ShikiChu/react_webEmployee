import React,{Component} from "react";
import {Variable} from "./Variable";

export default class Department extends Component{

    constructor (props) {
        super(props);

        // department data from api into array
        this.state={
            departments:[],
            modalTitle : "",
            DepartmentName : "",
            DepartmentId : 0,

            // filter
            DepartmentIdFilter:"",
            DepartmentNameFilter:"",
            departmentNoFilter:[]
        }
    }

    // Method to fetch department data from the API
    apiGetList() {
        fetch(Variable.API_URL + 'department')
        .then(response => response.json())
        .then(data => {
            // Update state with fetched data
            this.setState({ departments: data, departmentNoFilter: data});
        })
        .catch(error => {
            console.error('Error fetching department data:', error);
        });
    }

    // Lifecycle method: called after the component is mounted
    componentDidMount(){
        this.apiGetList();
    }
    // post api to create new record
    createDepartment() {
        fetch(Variable.API_URL + 'department', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DepartmentName: this.state.DepartmentName
            })
        })
        .then(res => res.json()) 
        .then((result) => {
            console.log(result);
            this.apiGetList();
        })
        .catch(error => {
            console.log('Error Msg:', error);
        })
    }

    // put api to update the record
    changeDepartment() {
        fetch(Variable.API_URL + 'department', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DepartmentId: this.state.DepartmentId,
                DepartmentName: this.state.DepartmentName
            })
        })
        .then(res => res.json()) 
        .then((result) => {
            console.log(result);
            this.apiGetList();
        })
        .catch(error => {
            console.log('Error Msg:', error);
        })
    }

    deleteDepartment(id) {
        if(window.confirm('Are you sure to delete this record?')){
            fetch(Variable.API_URL + 'department/' + id, {
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
            })
            .catch(error => {
                console.log('Error Msg:', error);
            })

        }
        
    }

    deptFilter() {
        var DepartmentIdFilter = this.state.DepartmentIdFilter;
        var DepartmentNameFilter = this.state.DepartmentNameFilter;
        var departmentNoFilter = this.state.departmentNoFilter.filter(function(el) {
            return el.departmentId.toString().toLowerCase().includes(DepartmentIdFilter.toString().trim().toLowerCase()) &&
                el.departmentName.toString().toLowerCase().includes(DepartmentNameFilter.toString().toLowerCase().trim());
        });
    }
    
    
     

    changeDeptName = (e) =>{
        this.setState({DepartmentName:e.target.value})
    }

    addClick = () =>{
        this.setState({
            modalTitle:"Add New Department",
            DepartmentId:0,
            DepartmentName:""
        })
    }

    editClick = (dep) => {
        this.setState({
            modalTitle: "Edit Department",
            DepartmentId: dep.departmentId,
            DepartmentName: dep.departmentName
        });
    }
    
    render() {
        const { departments, DepartmentId, DepartmentName, modalTitle} = this.state;
        return(
            <div>
                <h2>Department List</h2>
                {/* button to trigger modal */}
                <button
                type="button" 
                className="btn btn-primary float-right mb-2" 
                data-toggle="modal" 
                data-target="#exampleModal"
                onClick={this.addClick}>Add Department</button>


                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">Department Id</th>
                        <th scope="col">Department Name</th>
                        <th scope="col">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                        {departments.map(dep=>
                        <tr key={dep.departmentId}>
                            <td>
                                {dep.departmentId}
                            </td>
                            <td>
                                {dep.departmentName}
                            </td>
                            <td>
                                {/* button to trigger modal   */}
                                <button type="button" 
                                className="btn btn-light md-1" 
                                data-toggle="modal" 
                                data-target="#exampleModal"
                                onClick={() => this.editClick(dep)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>
                                <button type="button" className="btn btn-light md-1" onClick={()=>this.deleteDepartment(dep.departmentId)}>
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
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Department Name:</span>
                            <input type='text' className="form-control" value={DepartmentName} onChange={this.changeDeptName} />
                        </div>
                        
                        {/* check insert or update */}
                        {DepartmentId === 0 ?

                        <button 
                        type="button" 
                        className="btn btn-outline-primary float-left"
                        onClick={()=>this.createDepartment()}
                        >Create</button> : null
                        }
                        {DepartmentId !== 0 ?

                        <button type="button" 
                        className="btn btn-outline-primary float-left"
                        onClick={()=>this.changeDepartment()}>Save changes</button> : null
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