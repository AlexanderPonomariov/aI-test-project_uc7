import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import MyFormComponent from './MyFormComponent';

fetchMock.enableMocks();

describe('<MyFormComponent />', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should render the form correctly', () => {
    const { getByPlaceholderText } = render(<MyFormComponent />);

    expect(getByPlaceholderText('Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();

    const maleRadio = document.querySelector('input[value="male"]');
    expect(maleRadio).toBeInTheDocument();

    const femaleRadio = document.querySelector('input[value="female"]');
    expect(femaleRadio).toBeInTheDocument();

    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Submit');
  });

  it('should not display error messages for valid form fields', async () => {
    const { queryByText } = render(<MyFormComponent />);

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const agreeTermsCheckbox = document.querySelector('input[name="agreeTerms"]');
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.click(maleRadio);
    fireEvent.click(agreeTermsCheckbox);

    await waitFor(() => {
      expect(queryByText('Name must be at least 3 characters.')).not.toBeInTheDocument();
      expect(queryByText('Email must be valid.')).not.toBeInTheDocument();
      expect(queryByText('You must agree to the terms.')).not.toBeInTheDocument();
      expect(queryByText('You must select a gender.')).not.toBeInTheDocument();
    });
  });

  it('should send a POST request on form submission', async () => {
    render(<MyFormComponent />);

    fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }));

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const agreeTermsCheckbox = document.querySelector('input[name="agreeTerms"]');
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.click(maleRadio);
    fireEvent.click(agreeTermsCheckbox);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://httpbin.org/post',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'John', age: 30 }),
        })
      );
    });
  });

  it('should handle names of any length without error', async () => {
    const { queryByText } = render(<MyFormComponent />);

    fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }));

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const agreeTermsCheckbox = document.querySelector('input[name="agreeTerms"]');
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    const submitButton = document.querySelector('button[type="submit"]');

    const veryLongName = 'A'.repeat(1000); // A name of 1000 characters

    fireEvent.change(nameInput, { target: { value: veryLongName } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.click(maleRadio);
    fireEvent.click(agreeTermsCheckbox);

    fireEvent.click(submitButton);

    // Wait for potential asynchronous updates
    await waitFor(() => {
      // Ensure no error message related to the name field is displayed
      expect(queryByText('Name must be at least 3 characters.')).not.toBeInTheDocument();

      // Verify that fetch was called (indicating form submission happened)
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });


  it('should handle complex email addresses without error', async () => {
    const { queryByText } = render(<MyFormComponent />);

    fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }));

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const agreeTermsCheckbox = document.querySelector('input[name="agreeTerms"]');
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    const submitButton = document.querySelector('button[type="submit"]');

    const complexEmail = 'test.name+alias@example.co.uk';

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: complexEmail } });
    fireEvent.click(maleRadio);
    fireEvent.click(agreeTermsCheckbox);

    fireEvent.click(submitButton);

    // Wait for potential asynchronous updates
    await waitFor(() => {
      // Ensure no error message related to the email field is displayed
      expect(queryByText('Email must be valid.')).not.toBeInTheDocument();

      // Verify that fetch was called (indicating form submission happened)
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should change the gender from male to female and submit without errors', async () => {
    const { queryByText } = render(<MyFormComponent />);

    fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }));

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const agreeTermsCheckbox = document.querySelector('input[name="agreeTerms"]');
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    const femaleRadio = document.querySelector('input[name="gender"][value="female"]');
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.click(agreeTermsCheckbox);
    fireEvent.click(maleRadio);

    // Change gender from male to female
    fireEvent.click(femaleRadio);

    fireEvent.click(submitButton);

    // Wait for potential asynchronous updates
    await waitFor(() => {
      // Ensure no error messages are displayed
      expect(queryByText('Name must be at least 3 characters.')).not.toBeInTheDocument();
      expect(queryByText('Email must be valid.')).not.toBeInTheDocument();
      expect(queryByText('You must agree to the terms.')).not.toBeInTheDocument();
      expect(queryByText('You must select a gender.')).not.toBeInTheDocument();

      // Verify that fetch was called (indicating form submission happened)
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should re-submit the form after an initial successful submission', async () => {
    const { queryByText } = render(<MyFormComponent />);

    fetchMock.mockResponses(
      JSON.stringify({ data: 'first submission' }),
      JSON.stringify({ data: 'second submission' })
    );

    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const agreeTermsCheckbox = document.querySelector('input[name="agreeTerms"]');
    const femaleRadio = document.querySelector('input[name="gender"][value="female"]');
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.click(agreeTermsCheckbox);
    fireEvent.click(femaleRadio);

    // First submission
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Ensure no error messages are displayed after the first submission
      expect(queryByText('Name must be at least 3 characters.')).not.toBeInTheDocument();
      expect(queryByText('Email must be valid.')).not.toBeInTheDocument();
      expect(queryByText('You must agree to the terms.')).not.toBeInTheDocument();
      expect(queryByText('You must select a gender.')).not.toBeInTheDocument();

      // Verify that fetch was called once
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Re-submit the form
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Ensure no error messages are displayed after the second submission
      expect(queryByText('Name must be at least 3 characters.')).not.toBeInTheDocument();
      expect(queryByText('Email must be valid.')).not.toBeInTheDocument();
      expect(queryByText('You must agree to the terms.')).not.toBeInTheDocument();
      expect(queryByText('You must select a gender.')).not.toBeInTheDocument();

      // Verify that fetch was called twice, indicating two submissions
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    // Clear the mocks after your test to ensure a clean state for other tests
    fetchMock.resetMocks();
  });

  it('should display an error when Name field is left blank', async () => {
    const { getByText } = render(<MyFormComponent />);
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.click(submitButton);

    expect(getByText('Name must be at least 3 characters.')).toBeInTheDocument();
  });

  it('should display an error for an invalid email address', async () => {
    const { getByText } = render(<MyFormComponent />);
    const emailInput = document.querySelector('input[name="email"]');
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.change(emailInput, { target: { value: 'invalidEmail' } });
    fireEvent.click(submitButton);

    expect(getByText('Email must be valid.')).toBeInTheDocument();
  });

  it('should display an error when Agree to Terms checkbox is not checked', async () => {
    const { getByText } = render(<MyFormComponent />);
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.click(submitButton);

    expect(getByText('You must agree to the terms.')).toBeInTheDocument();
  });

  it('should display an error when no gender is selected', async () => {
    const { getByText } = render(<MyFormComponent />);
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.click(submitButton);

    expect(getByText('You must select a gender.')).toBeInTheDocument();
  });

  it('should display an error when name is less than 3 characters long', async () => {
    const { getByText } = render(<MyFormComponent />);
    const nameInput = document.querySelector('input[name="name"]');
    const submitButton = document.querySelector('button[type="submit"]');

    fireEvent.change(nameInput, { target: { value: 'Jo' } });
    fireEvent.click(submitButton);

    expect(getByText('Name must be at least 3 characters.')).toBeInTheDocument();
  });
});
