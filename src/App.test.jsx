import { render } from '@testing-library/react';
import App from './App';

describe('App Component Tests', () => {

  it('should render the App component without crashing', () => {
    render(<App />);
  });

  it('should display the header with .App-header class', () => {
    const { container } = render(<App />);
    const headerElement = container.querySelector('.App-header');
    expect(headerElement).toBeInTheDocument();
  });

  it('should display the logo inside the header', () => {
    const { getByAltText } = render(<App />);
    const logoImage = getByAltText('logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage.className).toContain('App-logo');
  });

  it('should render the MyFormComponent inside App', () => {
    const { container } = render(<App />);
    const formElement = container.querySelector('form'); // Assuming MyFormComponent has a form as its root element
    expect(formElement).toBeInTheDocument();
  });
});
