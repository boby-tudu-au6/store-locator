import React from 'react'
import db from 'db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSelector } from 'react-redux'
import { Grid, Paper, Box, Button } from '@mui/material'
import { Delete } from '@mui/icons-material'

function Bookmark() {
    const user = useSelector(state => state.user)
    const liveBookmark = useLiveQuery(() => db.bookmarks.filter(item => item.author === user.id).toArray())
    const removeBookmark = async (item) => {
        try {
            await db.bookmarks.delete(item.name)
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Grid container spacing={3}>
            {
                liveBookmark && liveBookmark.map((item) => (
                    <Grid item key={item.name} xs={12} sm={6} md={4}>
                        <Paper>
                            <iframe
                                width="100%"
                                height="480"
                                src={`https://datastudio.google.com/embed/reporting/430242fa-4162-4950-a984-824b3b355b3c/page/dQMwC?params=%7B"ds2.name2":"${item.name}"%7D`}
                                allowFullScreen />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button sx={{ m: 2 }} startIcon={<Delete />} onClick={() => removeBookmark(item)}>Remove</Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Bookmark