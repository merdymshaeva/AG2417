import { blue, red } from '@material-ui/core/colors';
import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Input } from 'reactstrap';

const ExampleDrop = (props) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="info">
          
        Here it would be amazing if we could choose stuff
      </DropdownToggle>
      <DropdownMenu>
        {/* <DropdownItem header>Header</DropdownItem>
        <DropdownItem href="http://placekitten.com/2000/3000">A cat</DropdownItem>
        <DropdownItem href="http://placekitten.com/g/2000/0300">New cat (black and white)</DropdownItem>
        {/* <DropdownItem divider /> */}
        {/* <DropdownItem href = "http://placekitten.com/2000/3000">Another cat</DropdownItem> */}

        <div className="mt-2" Text style={{color:red}} >DO YOU WANT a HAPPY BUTTON OR SAD ONE?</div>
              <FormGroup check>
                    <Input type="radio" name="radio1" />{' '}
                     HAPPY BUTTON
              </FormGroup>
              <FormGroup check>
                    <Input type="radio" name="radio1" />{' '}
                     HAPPY BUTTON NR TWO
              </FormGroup>

      </DropdownMenu>
    </ButtonDropdown>
  );
}



export default ExampleDrop;