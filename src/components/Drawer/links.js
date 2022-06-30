
import { Home, Bookmark } from '@mui/icons-material'
const links = [
    {
        to: '/',
        title: "Home",
        icon: <Home sx={{ fontSize: 30 }} />
    },
    {
        to: '/bookmarks',
        title: "Bookmarked Restaurants",
        icon: <Bookmark style={{ fontSize: 25 }} />
    },
]

export default links