export const useWebApiResponseParser = () => {
    return {
        getErrorMessage: (response, messageMap, fieldMap) => {
            if(response){
                if(response.status === 401){
                    return "No access";
                }
                else if (response.status === 422){
                    if(response._data && response._data.errors){
                        let messages = [];
                        const messageMapEx = { ...defaultValidationMessages, ...messageMap };
                        const fieldMapEx = { ...defaultFieldNames, ...fieldMap };

                        response._data.errors.forEach(e => {
                            messages.push(`Error field ${fieldMapEx[e.fieldName] ?? e.fieldName}: ${messageMapEx[e.error] ?? e.error}`);
                        });

                        return messages.join('\n');
                    }

                    return "Insert wrond data";
                }
                else{
                    if(response._data && response._data.error){
                        return messageMap[response._data.error] ?? response._data.error;
                    }

                    return "Error";
                }
            }

            return "";
        }
    };
};

const defaultValidationMessages = {
    "NotEmptyValidator" : "Field can't be empty",
    "EmailValidator" : "Wrong Email"
}

const defaultFieldNames = {
    "Email" : "Email",
    "Password" : "Password"
}