import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { FormError } from './FormError';

describe('FormError', () => {
  it('renders the error message correctly', () => {
    render(<FormError>This is an error message</FormError>);
    const errorMessage = screen.getByText('This is an error message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('applies default error styling classes', () => {
    render(<FormError>Error Text</FormError>);
    const errorMessage = screen.getByText('Error Text');
    expect(errorMessage).toHaveClass('text-red-500');
    expect(errorMessage).toHaveClass('text-sm');
    expect(errorMessage).toHaveClass('mt-1');
  });

  it('applies additional custom class names', () => {
    render(<FormError className="custom-error-class extra-margin">Custom Error</FormError>);
    const errorMessage = screen.getByText('Custom Error');
    expect(errorMessage).toHaveClass('custom-error-class');
    expect(errorMessage).toHaveClass('extra-margin');
    // Ensure default classes are still present
    expect(errorMessage).toHaveClass('text-red-500');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<FormError ref={ref}>Ref Error</FormError>);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('Ref Error');
  });

  it('passes through arbitrary DOM props', () => {
    render(<FormError id="my-error" data-testid="form-error-test">Props Error</FormError>);
    const errorMessage = screen.getByTestId('form-error-test');
    expect(errorMessage).toHaveAttribute('id', 'my-error');
  });

  it('does not render if children is null, undefined, or an empty string', () => {
    const { container: nullContainer } = render(<FormError>{null}</FormError>);
    expect(nullContainer).toBeEmptyDOMElement();

    const { container: undefinedContainer } = render(<FormError>{undefined}</FormError>);
    expect(undefinedContainer).toBeEmptyDOMElement();

    const { container: emptyStringContainer } = render(<FormError>{''}</FormError>);
    // The component explicitly checks for `!children`, which is true for empty strings.
    // Therefore, it should not render a <p> tag.
    expect(emptyStringContainer).toBeEmptyDOMElement();
  });
});
