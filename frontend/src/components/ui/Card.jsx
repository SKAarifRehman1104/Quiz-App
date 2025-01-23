export const Card = ({ children, ...props }) => (
    <div className="shadow-md bg-white rounded" {...props}>
      {children}
    </div>
  );
  
  export const CardContent = ({ children, ...props }) => (
    <div className="p-4" {...props}>
      {children}
    </div>
  );
  
  export const CardHeader = ({ children, ...props }) => (
    <div className="p-4 bg-gray-100 rounded-t" {...props}>
      {children}
    </div>
  );
  
  export const CardTitle = ({ children, ...props }) => (
    <h2 className="text-lg font-bold" {...props}>
      {children}
    </h2>
  );
  