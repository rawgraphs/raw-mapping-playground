import React from 'react'
import { Navbar, Nav, Dropdown, Icon } from 'rsuite';


export default function Header(){

  return  <Navbar appearance="inverse">
   
  <Navbar.Body>
    <Nav>
      <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
      <Dropdown title="Load">
        <Dropdown.Item>blah</Dropdown.Item>
        <Dropdown.Item>blah</Dropdown.Item>
        <Dropdown.Item>blah</Dropdown.Item>
      </Dropdown>
    </Nav>
    <Nav pullRight>
      <Nav.Item >RAWGraphs Mapping Playground</Nav.Item>
    </Nav>
  </Navbar.Body>
</Navbar>


}