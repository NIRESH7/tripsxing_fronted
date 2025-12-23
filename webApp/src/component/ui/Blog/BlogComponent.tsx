import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';
interface JoditEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}
const BlogEditor: React.FC<JoditEditorProps> = ({ value, onChange, disabled }) => {
    const editor = useRef(null);


    const uploadToS3 = async (file: File) => {
        console.log('Uploading to S3:', file);
        try {
            // const uploadResult = await PostApiCustomerRoutes(
            //     route.backend.uploadfile,
            //     file,
            //     TripxingToken ?? ''
            // )
            // return uploadResult.Location; // Return the URL of the uploaded file
        } catch (error) {
            console.error('Error uploading to S3:', error);
            return '';
        }
    };

    const config = {
        readonly: disabled, // all options from https://xdsoft.net/jodit/doc/
        height: 400,
        toolbarSticky: false,
        toolbarAdaptive: false,
        uploader: {
            insertImageAsBase64URI: false,
            url: '/dummy-url',
            filesVariableName: (files: number) => {
                console.log(files);
            },
            process: async (formData: { get: (arg0: string) => File; }, editor: { selection: { insertImage: (arg0: string | undefined) => void; }; }) => {
                const file = formData.get('files') as File;
                const url = await uploadToS3(file);
                editor.selection.insertImage(url);
            },
        },

    };

    // Custom image upload handler
    // const handleImageUpload = (file: File) => {
    //     const formData = new FormData();
    //     formData.append('image', file);

    //     return fetch('https://api.imgur.com/3/image', {
    //         method: 'POST',
    //         headers: {
    //             Authorization: 'Client-ID 9e57cb1c4791cea'
    //         },
    //         body: formData
    //     }).then(response => response.json()).then(data => {
    //         console.log(data);
    //         return data.data.link;
    //     });
    // }

    // const handleFileUpload = (file: File) => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     return fetch('https://api.imgur.com/3/image', {
    //         method: 'POST',
    //         headers: {
    //             Authorization: 'Client-ID 9e57cb1c4791cea'
    //         },
    //         body: formData
    //     }).then(response => response.json()).then(data => {
    //         console.log(data);
    //         return data.data.link;
    //     });
    // }


    return (
        <JoditEditor
            ref={editor}
            value={value}
            config={config}
            onBlur={(newContent) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
        // onChange={(newContent) => {
        //     // console.log(newContent);
        // }}

        />
    )
}

export default BlogEditor;