import { ErrorIcon, CheckIcon, ExclamationIcon, InfoIcon } from "./icons";

var classNames = require("classnames");

/**
 * component to show alert messages.
*/
export default function Alert({ message, type }) {

  const divClasses = classNames(
    "w-full p-3 rounded-md flex flex-row",
    { "bg-red-200": type === "error" },
    { "text-red-500": type === "error" },
    { "bg-green-200": type === "success" },
    { "text-green-500": type === "success" },
    { "bg-yellow-200": type === "warning" },
    { "text-yellow-500": type === "warning" },
    { "bg-blue-200": type === "info" },
    { "text-blue-500": type === "info" }
  );

  return (
    <div className={divClasses}>
      {type === "error" && <ErrorIcon className="h-6 w-6 mr-3" />}
      {type === "success" && <CheckIcon className="h-6 w-6 mr-3" />}
      {type === "warning" && <ExclamationIcon className="h-6 w-6 mr-3" />}
      {type === "info" && <InfoIcon className="h-6 w-6 mr-3" />}
      <span>{message}</span>
    </div>
  );
}
