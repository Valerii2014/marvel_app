import './searchCharForm.scss';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import useMarvelService from '../../services/MarvelService';



const setContent = (process, char, Component, updateName) => {
  switch (process) {
      case 'waiting':
          return null;
      case 'loading':
          return null;
      case 'confirmed':
          return Component(char, updateName);
      case 'error':
          return (
            <div className='error'>The character was not found. Check the name and try again</div>
          );            
      default:
          throw new Error('Unexpected process state');
  }
}

const SearchCharForm = () => {

  const {process, setProcess, getCharacterByName} = useMarvelService();
  const [char, setChar] = useState(null);
  
  const onLoadChar = async (name) => {
    await getCharacterByName(name)
    .then(onLoadedChar)   
  }
  
  const onLoadedChar = (char) => {
    setChar(char);
    char.length === 1 ? setProcess('confirmed') : setProcess('error');
  }

  const getUpdateName = (char) => {
    const name = char[0].name;
    if(name.length > 15){ 
      return {
        first: name.slice(0, 15),
        second: name.slice(15, name.length)
      }
    }
    return {first: name}
  }

  

  const View = (char, updateName) => {
    const name = updateName(char);
        return (
          <div className='error' style={{'color': '#03710E'}}>
                        There is! Visit
                        {` ${name.first} `}
                        {name.second ? <br/> : null}
                        {name.second ? `${name.second} ` : null} 
                        page?
                     </div>
        ) 
  }

  const LinkToCharPage = process === 'confirmed' ? 
                        (<Link to={`/characters/${char[0].name}`}>
                                <button className="button button__secondary">
                                  <div className="inner">TO PAGE</div>
                                </button>
                         </Link>) : null;

    return (
        <Formik
        initialValues={{title: ''}}
        validate={values => {
          setProcess('waiting')
          const errors = {};
          if (!values.title) {
            errors.title = 'This field is required';
          } else if (values.title.length < 4) {
            errors.title= 'Character name has be more three symbols';
          }
          return errors;
        }}
        onSubmit={values => {
            onLoadChar(values.title)
        }}>
        
          <Form className='form'>
            <div className="form__container">
              <div className="form__search-field">
                <label htmlFor='title' className='form__label'>Or find a character by name:</label>
                <Field 
                    className='form__input'
                    type="text" 
                    name="title"
                    placeholder="Enter name"/>
              </div>
                
              <div className="form__btns">
                  <button className="button button__main"
                          disabled={process === 'loading' ? true : false}
                          type="submit">
                      <div className="inner">FIND</div>
                  </button>
                  {LinkToCharPage}
              </div>
            </div>
            <FormikErrorMessage className='error' name="title" component="div" />
              {setContent(process, char, View, getUpdateName)}
          </Form>
      </Formik>
    )
}

export default SearchCharForm;