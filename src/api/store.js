import axios from "axios"
import db from "db"

export const fetchStores = async () => {
    try {
        const { data } = await axios.get('restaurants?view=Grid%20view')
        if (data) {
            localStorage.setItem('stores', 'fetched')
            await db.stores.bulkPut(data.records)
        }
    } catch (error) {
        console.log(error.message)
    }
}