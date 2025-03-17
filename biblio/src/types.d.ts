//type for components/Card.tsx
interface Props {
    data: {
        _id: string;
        title: string;
        author: string;
        genre: string;
        image: string;
    }
}

//type for components/PostFormModal.tsx
interface PostFormModalProps {
    show: boolean;  
    onClose: () => void;
    
}

//type for components/PostFormData.tsx
interface FormData {
    title: string;
    author: string;
    genre: string;
    description: string
} 

//type for components/UpdateFormModal.tsx
interface UpdateFormModalProps {
    id: string;
    show: boolean;
    onClose: () => void;
}


//type for components/UpdateFormData.tsx
interface FormUpdateData {
    title: string;
    author: string;
    genre: string;
    description: string;
    image: File | null;
}

//type for components/UpdateFormData.tsx
type UpdateFormDataProps = {
    id: string; 
}
