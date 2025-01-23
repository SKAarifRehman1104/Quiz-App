export const Button = ({ children, ...props }) => (
    <button className="p-8 bg-blue-500 text-white rounded border-red-500" {...props}>
      {children}
    </button>
  );
  