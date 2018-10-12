import React from 'react';
import {shallow} from 'enzyme';
import Home from '../client/app/components/Home/Home';

describe('Home', () => {
 let wrapper;

 beforeEach(() => {
   wrapper = shallow(<Home/>);
 });

});