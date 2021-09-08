import React, { useState, useEffect } from "react";
import { v4 as uuid_v4 } from "uuid";
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import "./App.css";
import Header from "./Header";
import api from '../api/contact'
import AddContacts from "./AddContacts";
import ContactList from "./ContactList";
import ContactCard from "./ContactCard";
import ContactDetail from "./ContactDetail";
import EditContact from "./EditContacts";
import EditContacts from "./EditContacts";
import contact from "../api/contact";

function App() {
  //const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const retrieveContacts = async () =>{
    const response = await api.get("/contacts");
    return response.data

  }
  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id:uuid_v4(),
      ...contact
    }

    const response = await api.post("/contacts", request);
    console.log(response)
    setContacts([...contacts, response.data]);

  };
  const updateContactHandler = async (contact) => {
    const response = await api.put('/contacts/'+(contact.id),  contact)
    const {id, name,email} = response.data;
    setContacts(contacts.map((contact)=>{
      return contact.id === id ? {...response.data} : contact;
    })
    );
  };

  const removeContactHandler = async (id) => {
    await api.delete('/contacts/' + id);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if(searchTerm !== ""){
      const newContactList = contacts.filter((contact) =>{
        return Object.values(contact).join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
      
    }else{
      setSearchResults(contacts);
    }
  };
  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if(allContacts) setContacts(allContacts);
    };
    getAllContacts();
  }, []);
  useEffect(() => {
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>
      <Header />
      <Switch>
      <Route path='/contact/:id' component={ContactDetail}/>
      <Route path='/' exact render={(props) => (<ContactList{...props} contacts={searchTerm.length< 1 ?  contacts: searchResults} getContactId={removeContactHandler}  term={searchTerm} searchKeyword={searchHandler}/>)}/>
      <Route path='/add' render={(props) => (<AddContacts{...props} addContactHandler={addContactHandler}/>)}/>
      <Route path='/edit' render={(props) => (<EditContacts{...props} updateContactHandler={updateContactHandler}/>)}/> 
      </Switch>
        </Router>
      
    </div>
  );
}

export default App;
