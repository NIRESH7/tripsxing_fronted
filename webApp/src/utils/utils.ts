import { FormField } from "../interfaces/interfaces";

export const TripxingToken = localStorage.getItem('TripxingToken');


export const menuRouteHelperFunction = (menuDisplayName: string, menuKey: string) => {
    // console.log("menuDisplayName", menuDisplayName);
    console.log("menuKey", menuKey);
    switch (menuDisplayName) {
        case ('Users'):
            return 'userMaster'
        case ('JOB Type'):
            return 'jobMaster'
        case ('Role'):
            return 'roleMaster'
        case ('Department'):
            return 'departmentMaster'
        case ('Reference Type'):
            return 'referenceTypeMaster'
        case ('General Comments'):
            return 'generalCommentsMaster'
        case ('Expert Comments'):
            return 'expertCommentsMaster'
        case ('Sample Type'):
            return 'sampleTypeMaster'
        case ('Units'):
            return 'unitsMaster'
        case ('Parameters'):
            return 'parameterMaster'
        case ('Parameter Lists'):
            return 'parameterlistMaster'
        case ('Limits Types'):
            return 'limitTypes'
        case ('Limit Rules'):
            return 'limitRules'
        case ('Approval Types'):
            return 'approvalTypes'
        case ('Standard'):
            return 'standardMaster'
        case ('Test Methods'):
            return 'testMethodMaster'
        case ('CheckList'):
            return 'checklistMaster'
        case ('Attributes'):
            return 'attributeMaster'
        case ('Specifications'):
            return 'specificationMaster'
        case ('Product Specification Limit'):
            return 'productSpecificationMaster'
        case ('Customers'):
            return 'CustomerMaster'
        default:
            return ''
    }
}


export const DateGenerator = (date: string) => {
    const time = new Date().getTime();

    switch (date) {
        case 'YYMMDD':
            return `${new Date().getFullYear()}-${(new Date().getMonth() < 10 ? '0' : '') + (new Date().getMonth() + 3)}-${(new Date().getDate() < 10 ? '0' : '') + new Date().getDate()}`
        case 'DDMMYY':
            return `${(new Date().getDate() < 10 ? '0' : '') + new Date().getDate()}-${(new Date().getMonth() < 10 ? '0' : '') + (new Date().getMonth() + 3)}-${new Date().getFullYear()}`
        case 'YYMMDDHHMM':
            return `${new Date().getFullYear()}-${(new Date().getMonth() < 10 ? '0' : '') + (new Date().getMonth() + 3)}-${(new Date().getDate() < 10 ? '0' : '') + new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`
        case 'YYMMDDHHMMSS':
            return `${new Date().getFullYear()}-${(new Date().getMonth() < 10 ? '0' : '') + (new Date().getMonth() + 3)}-${(new Date().getDate() < 10 ? '0' : '') + new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        case 'DDMMMYYYY':
            return `${(new Date().getDate() < 10 ? '0' : '') + new Date().getDate()} ${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`
    }
    return time
}

export const getWidgetStyle = (
    isMaximized: boolean
): React.CSSProperties => {
    return {
        position: "relative",
        width: isMaximized ? "" : "50vw",
        height: isMaximized ? "100vh" : "auto",
        backgroundColor: "#F2f2f2",
        padding: "1%",
    } as React.CSSProperties;
};

export const dropdownStyle = {
    display: "flex",
    alignItems: "center",
    padding: "1.25rem 0.5rem 1.25rem 0.5rem",
    gap: "0.25rem",
    borderRadius: "0.25rem",
    border: "1px solid #000",
    background: "#FFF",
    fontSize: "0.875rem",
    fontStyle: "normal",
    fontWeight: 500,
}


export const valueSetter = (field: string) => {
    switch (field) {
        case "input":
            return "value";
        case "select":
            return "value";
        // return "defaultValue";
        case "textarea":
            return "value";
        // "defaultValue";
        case "checkbox":
            return "checked";
        case "text":
            return "value";
        // case "radio":
        //   return "value";
        case "password":
            return "value";
        case "email":
            return "value";
        case "date":
            return "value";
        default:
            return "value";
    }
}

export const setDefaultValues = (
    field: FormField
) => {
    if (field.data.length > 0) {
        if (field.isInput === "select") {
            return field.isInputProps?.defaultValue;
        } else if (field.isInput === "radio") {
            return field.isInputProps?.defaultValue;
        } else if (field.isInput === "checkbox") {
            return field.isInputProps?.defaultChecked;
        } else if (
            field.isInput === "text" ||
            field.isInput === "textarea" ||
            field.isInput === "input" ||
            field.isInput === "email" ||
            field.isInput === "password"
        ) {
            return field.data[0].value;
        }
    }
    return undefined;
}


/*
 * generates random colors from  https://ant.design/docs/spec/colors. <color-4> used.
 */
export const getRandomColorFromString = (text: string) => {
    const colors = [
      "#ff9c6e",
      "#ff7875",
      "#ffc069",
      "#ffd666",
      "#fadb14",
      "#95de64",
      "#5cdbd3",
      "#69c0ff",
      "#85a5ff",
      "#b37feb",
      "#ff85c0",
    ];
  
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;
  
    return colors[hash];
  };
  
  export const getNameInitials = (name: string, count = 2) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const filtered = initials.replace(/[^a-zA-Z]/g, "");
    return filtered.slice(0, count).toUpperCase();
  };
  