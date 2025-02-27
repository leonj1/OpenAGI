// Mock implementation of @inkjs/ui components
import React from 'react';

export const Select = ({ items, onSelect }) => {
  return React.createElement('div', null, 'Select Component');
};

export const OrderedList = ({ items }) => {
  return React.createElement('div', null, 'OrderedList Component');
};

export const UnorderedList = ({ items }) => {
  return React.createElement('div', null, 'UnorderedList Component');
};

export const Button = ({ children, onPress }) => {
  return React.createElement('div', null, children || 'Button Component');
};

export const Box = ({ children }) => {
  return React.createElement('div', null, children || 'Box Component');
};

export const Text = ({ children }) => {
  return React.createElement('div', null, children || 'Text Component');
};

// Export all components as default export
export default {
  Select,
  OrderedList,
  UnorderedList,
  Button,
  Box,
  Text,
}; 