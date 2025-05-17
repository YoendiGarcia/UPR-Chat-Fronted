export interface FormField {
  type: 'text' | 'email' | 'password' | 'textarea' | 'checkbox' | 'select' | 'radio' | 'number' | 'date';
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  options?: { value: string; label: string }[]; // Para select y radio buttons
  className?: string;
  attributes?: Record<string, string>; // Atributos HTML adicionales
};

export interface FormConfig {
  fields: FormField[];
  formAttributes?: Record<string, string>;
  submitButtonText?: string;
  submitButtonClass?: string;
};