import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Define the shape of your data
interface ContentItem {
    name: string;
    age: number;
}
const API_URL = import.meta.env.VITE_API_BASE_URL;
function Listing() {
	console.log("LOMANDO.COM");
    // 2. Tell useState to expect an array of ContentItem
    const [content, setContent] = useState<ContentItem[]>([]);

    const mGetTable = () => {
        // In a real app, ensure your API route starts with / if it's absolute
        axios.get<ContentItem[]>(`${API_URL}/api/sample`) 
            .then((res) => {
                setContent(res.data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        mGetTable();
    }, []);

    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <table className='text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        <th>name</th>
                        <th>age</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((item, i) => (
                        <tr key={i} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200'>
                            {/* TypeScript now knows these properties exist! */}
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Listing;