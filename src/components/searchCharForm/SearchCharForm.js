import './searchCharForm.scss';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';


const SearchCharForm = () => {

  const {getCharacterByName, loading, error, clearError} = useMarvelService();

  const [char, setChar] = useState(null);

  const onNameChecked = (char) => {
    setChar(char)
  }

  const onCheckName = async (name) => {
      clearError();
      await getCharacterByName(name)
            .then(onNameChecked)
      
  }
  
  const getCharName = (char) => {
    if(char.length !== 1) return;

    const name = char[0].name;
    if(name.length > 15){
      
      return {
        first: name.slice(0, 15),
        second: name.slice(15, name.length)
      }
      
    }
    return {first: name}
  }


  const transformedName = char ? getCharName(char) : null;

  const ErrorContent = error ? <div className='error'><ErrorMessage/></div> : null;

  const FindedChar =  !char ? null : char.length === 1 ?
                    (<div className='error' style={{'color': '#03710E'}}>
                        There is! Visit
                        {` ${transformedName.first} `}
                        {transformedName.second ? <br/> : null}
                        {transformedName.second ? `${transformedName.second} ` : null} 
                        page?
                     </div>) : 
                      (<div className='error'>The character was not found. Check the name and try again</div>);

  const LinkToCharPage = char && char.length === 1 ? 
                        (<Link to={`/characters/${char[0].name}`}>
                                <button className="button button__secondary">
                                  <div className="inner">TO PAGE</div>
                                </button>
                         </Link>) : null;

    return (
        <Formik
        initialValues={{title: ''}}
        validate={values => {
          setChar(null)
          const errors = {};
          if (!values.title) {
            errors.title = 'This field is required';
          } else if (values.title.length < 4) {
            errors.title= 'Character name has be more three symbols';
          }
          return errors;
        }}
        onSubmit={values => {
            onCheckName(values.title)
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
                          disabled={loading}
                          type="submit">
                      <div className="inner">FIND</div>
                  </button>
                  {LinkToCharPage}
              </div>
            </div>
            <FormikErrorMessage className='error' name="title" component="div" />
            {FindedChar}
            {ErrorContent}
          </Form>
      </Formik>
    )
}

export default SearchCharForm;