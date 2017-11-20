import React from 'react'

import LoginForm from '../LoginForm'
import AuthReducer, { INITIAL_STATE } from '../../reducers/AuthReducer'

import {
  LOGIN_USER_FAIL,
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
} from '../../actions/types'

const shapeState = ( state ) => ( { auth: state } )

test( 'INITIAL_STATE', () => {
  const wrapper = shallowWithStore( <LoginForm />, shapeState( INITIAL_STATE ) )
  expect( wrapper.dive() ).toMatchSnapshot()
} )

test( 'LOGIN_USER_START', () => {
  const startState = AuthReducer( INITIAL_STATE, { type: LOGIN_USER_START } )
  const wrapper = shallowWithStore( <LoginForm />, shapeState( startState ) )
  expect( wrapper ).toMatchSnapshot()
} )

test( 'LOGIN_USER_FAIL', () => {
  const errorState = AuthReducer( INITIAL_STATE, { type: LOGIN_USER_FAIL } )
  const wrapper = shallowWithStore( <LoginForm />, shapeState( errorState ) )
  expect( wrapper ).toMatchSnapshot()
} )

test( 'LOGIN_USER_PASS', () => {
  const successState = AuthReducer( INITIAL_STATE, { type: LOGIN_USER_SUCCESS, payload: { foo: 'bar' } } )
  const wrapper = shallowWithStore( <LoginForm />, shapeState( successState ) )
  expect( wrapper ).toMatchSnapshot()
} )
