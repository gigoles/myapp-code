import React, {useRef}  from "react";
import ContactCard from "./ContactCard";
import {Link} from 'react-router-dom';

const ContactList = (props) => {
  console.log(props);
  const inputEl = useRef("");


  const deleteContactHandler = (id) =>{
      props.getContactId(id);
  };

  const renderContactlist =props.contacts.map((contact) => {
    return (
     <ContactCard contact = {contact} clickHandler ={deleteContactHandler} key={contact.id}></ContactCard>
    );
  });
  const getSearchTerm = () => {
    props.searchKeyword(inputEl.current.value)
  }
  return (
    <div className = 'main'>
      <br/>
    <h2>
      Contact List
      <Link to='/add'>
      <button className='ui button blue right' style= {{float: 'right'}} >Add contact</button>
      </Link>
      </h2>
      <div className='ui search'>

        <div className='ui icon input'>
          <input ref ={inputEl} type ='text' placeholder = 'search contacts' className='prompt' value = {props.term} onChange = {getSearchTerm}/>
          <i className = 'search icon'></i>

        </div>

      </div>
  <div className="ui called list">{renderContactlist.length > 0 ? renderContactlist: "No Contact Available" }</div>
  </div>);
};

export default ContactList;
