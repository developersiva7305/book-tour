const BASE_URL = "https://book-tour-5t6w.onrender.com"; // your Render backend URL

export const fetchData = async () => {
    const res = await fetch(`${BASE_URL}/api/data`);
    return res.json();
};
