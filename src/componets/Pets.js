import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import '../App.css';

class Pets extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            categoryData:{        
                id: 0,
                name: "",
            },
            tagsData: 
              {
                id: 0,
                name: '',
              },
            tags:[],
            modalAdd: false,
            modalDelete: false,
            modalView: false,
            captureData:{
              id: 0,
              id_category: 0,
              name_category: "",
              name: "",
              photoUrls: "",
              id_tags: "",
              name_tags: "",
              status: "",
            },
            form:{
              id: 0,
              category: {
                id: 0,
                name: "",
              },
              name: "",
              photoUrls: [
                ""
              ],
              tags: [
                {
                  id: 0,
                  name: '',
                }
            ],
              status: "",
            },
            
            typeModal: '',
            urlState: "https://petstore.swagger.io/v2/pet/findByStatus?status=available",
        }
    }

   getRequest = async(url) =>{
    await axios.get(url)
    .then(response =>{ 
        this.setState({data: response.data});
    }).catch(error => {
        console.log(error.response);
    })
   }

   postRequest=async()=>{
    console.log(this.state.form)
   await axios.post("https://petstore.swagger.io/v2/pet",this.state.form).then(response=>{
      this.modalAdd();
      this.getRequest(this.state.urlState);
    }).catch(error => console.log(error.response))
  }

  putRequest= async()=>{
    await axios.put("https://petstore.swagger.io/v2/pet", this.state.form)
    .then(response=>{
      this.modalAdd();
      this.getRequest(this.state.urlState);
    }).catch(error => 
      console.log(error.response))
  }

   deleteRequest= async (id)=>{
    await axios.delete("https://petstore.swagger.io/v2/pet/"+this.state.form.id).then(response=>{
      this.setState({modalDelete: false});
      this.getRequest(this.state.urlState);      
    })
  }
   componentDidMount() {
    this.getRequest(this.state.urlState);
   }

   modalAdd=()=>{
    this.setState({modalAdd: !this.state.modalAdd});
  }

  modalView=()=>{
    this.setState({modalView: !this.state.modalView});
  }

  fillForm= async (captureData) =>{
   await this.setState({
      form: {
        id: captureData.id,
        category: {
          id: captureData.id_category,
          name: captureData.name_category,
        },
        name: captureData.name,
        photoUrls: [
          captureData.photoUrls[0]
        ],
        tags: [
          {
            id: captureData.id_tags,
            name: captureData.name_tags,
          }
      ],
        status: captureData.status,
      },
    })
    this.state.typeModal==="update"?
    this.putRequest():
    this.postRequest()
  }

  selectPetDelete=(pet)=>{
    this.setState({
      form: {
        id: pet.id,
      },
      }
    )
  }

  displayRawData= async(pet)=>{
   await this.setState({
      captureData:{
        id: pet.id,
        id_category: pet.category.id,
        name_category: pet.category.name,
        name: pet.name,
        photoUrls: pet.photoUrls,
        id_tags: pet.tags[0].id,
        name_tags: pet.tags[0].name,
        status: pet.status,
      },
    })
    this.state.typeModal==="update"?
    this.modalAdd():
    this.modalView()
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      captureData:{     
        ...this.state.captureData,
        [e.target.name]: e.target.value
        
      }
    })
    }

   render(){
    const {captureData}=this.state;
    const {form}=this.state;
    return (
        <div className="container">
        <br /><br /><br />
        <button className="btn btn-success new_pet" onClick={()=>{this.setState({captureData: null, typeModal: 'add'}); this.modalAdd()}} >New Pet</button>
        <br /><br />
                <div className='filter'>
                    <label htmlFor="status">Status filter:</label>
                    <select className='custom-select' onChange={(e) => {
                        this.getRequest(e.target.value);      
                        this.setState({urlState: e.target.value});
                    }}>
                        <option value="https://petstore.swagger.io/v2/pet/findByStatus?status=available">Available</option>
                        <option value="https://petstore.swagger.io/v2/pet/findByStatus?status=pending">Pending</option>
                        <option value="https://petstore.swagger.io/v2/pet/findByStatus?status=sold">Sold</option>
                    </select>
                </div>
            <table className="table ">
                <thead>
                    <tr>
                    <th>Id Pet</th>
                    <th>Name Pet</th>
                    <th>Photo</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((pet, index) =>{                    
                    return(
                    <tr key={index}>
                        <td>{pet.id}</td>
                        <td>{pet.name}</td>
                        <td><a href={pet.photoUrls}> <img src = {pet.photoUrls} alt = "Pet" width="90" height="70"/></a></td> 
                        <td>             
                            <button className="btn btn-warning butons" onClick={()=>{this.displayRawData(pet);this.setState({typeModal:"view"})}}><FontAwesomeIcon className='icon' icon={faEye} /></button>
                            <button className="btn btn-primary butons" onClick={()=>{this.displayRawData(pet);this.setState({typeModal:"update"})}}><FontAwesomeIcon className='icon' icon={faEdit}/></button>
                            <button className="btn btn-danger butons" onClick={()=>{this.selectPetDelete(pet); this.setState({modalDelete: true})}}><FontAwesomeIcon className='icon' icon={faTrashAlt}/></button>
                        </td>
                    </tr>
                    )
                    })}
                </tbody>
            </table>

            <Modal isOpen={this.state.modalAdd}>
                <ModalHeader className= {this.state.typeModal==='add'? 'modal_header_green' : 'modal_header_blue'} style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalAdd()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">Id Pet</label>
                    {this.state.typeModal==='update'? 
                    <input className="form-control" type="number" name="id" readOnly id="id" onChange={this.handleChange} value={captureData?captureData.id: 0}/>  
                    : <input className="form-control" type="number" name="id" id="id" onChange={this.handleChange} value={captureData?captureData.id: 0}/>
                    }
                    <br />
                    <label htmlFor="name">Name Pet</label>
                    <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={captureData?captureData.name: ''}/>
                    <br />
                    <label htmlFor="photoUrls">URL Image</label>
                    <input className="form-control" type="text" multiple name="photoUrls" id="photoUrls" onChange={this.handleChange} value={captureData?captureData.photoUrls:""}/>
                    <br />
                    <label htmlFor="category_id">Id Category</label>
                    <input className="form-control" type="number" name="id_category" id="id_category" onChange={this.handleChange} value={captureData?captureData.id_category: 0}/>
                    <br />
                    <label htmlFor="category_name">Name Category</label>
                    <input className="form-control" type="text" name="name_category" id="name_category" onChange={this.handleChange} value={captureData?captureData.name_category: ""}/>
                    <br />
                    <label htmlFor="id_tags">Id Tags</label>
                    <input className="form-control" type="number" name="id_tags" id="id_tags" onChange={this.handleChange} value={captureData?captureData.id_tags: ""}/>
                    <br />
                    <label htmlFor="name_tags">Name Tags</label>
                    <input className="form-control" type="text" name="name_tags" id="name_tags" onChange={this.handleChange} value={captureData?captureData.name_tags: ""}/>
                    <br />
                    <label htmlFor="status">status</label>
                    <select className='form-control' name="status" id="status" onChange={this.handleChange } value={captureData?captureData.status:'available'}>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                    </select>
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.typeModal==='add'?
                    <button className="btn btn-success" onClick={()=>{this.fillForm(this.state.captureData)}}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.fillForm(this.state.captureData)}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalAdd()}>Cancel</button>
                </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalDelete}>
            <ModalBody className='modal_header_red'>
            You are sure you want to eliminate the pet {form && form.name}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.deleteRequest()}>Yes</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalDelete: false})}>No</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalView}>
            <ModalHeader className= "modal_header_yellow" style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalView()}>x</span>
                </ModalHeader>
            <ModalBody className=''>
            {this.state.captureData!==null?
            <div className='pet_img'>
              <a  href={this.state.captureData.photoUrls}> <img src = {this.state.captureData.photoUrls} alt = "Pet" width="90" height="70"/></a>
              <br/>           
              <label htmlFor="id">Id Pet: {this.state.captureData.id}</label>
              <br/>
              <label htmlFor="name">Name Pet: {this.state.captureData.name}</label>
              <br/>
              <label htmlFor="id_category">Id Category: {this.state.captureData.id_category}</label>
              <br/>
              <label htmlFor="name_category">Name Category: {this.state.captureData.name_category}</label>
              <br/>
              <label htmlFor="id_tags">Id Tags: {this.state.captureData.id_tags}</label>
              <br/>
              <label htmlFor="name_tags">Name Tags: {this.state.captureData.name_tags}</label>
              <br/>
              <label htmlFor="status">Status: {this.state.captureData.status}</label>
            </div>
            :
            <div></div>
          }  
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-warning" onClick={()=>this.setState({modalView:false})}>Close</button>
            </ModalFooter>
          </Modal>

        </div>
    )
   }
}
  

export default Pets