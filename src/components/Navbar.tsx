import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useWallet } from '../utils/useWallet'
import { useState, useEffect } from 'react'

type NavbarProps = {
    useWallet: ReturnType<typeof useWallet>
}

export default function Navbar(props: NavbarProps) {
    const { connectWallet, disconnectWallet, getActiveAccount } = props.useWallet
    const [activeAccount, setActiveAccount] = useState<string | null>(null)

    useEffect(() => {
        getActiveAccount().then((account) => {
            setActiveAccount(account)
        })
    }, [])

    const connect = async () => {
        await connectWallet()
        const account = await getActiveAccount()
        setActiveAccount(account)
    }

    const disconnect = async () => {
        await disconnectWallet()
        setActiveAccount(null)
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Escrow
                    </Typography>
                    { activeAccount ? (
                        <>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                {activeAccount}
                            </Typography>
                            <Button color="inherit" style={{color: 'red'}} onClick={disconnect}>Disconnect</Button>
                        </>
                    ) : 
                        <Button color="inherit" style={{color: 'green'}} onClick={connect}>Connect</Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    )
}