import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
        heading: "'Nunito Sans', sans-serif",
        body: "'Nunito Sans', sans-serif",
    },
    colors: {
        darkBlue: '#273142',
        darkerBlue: '#1B2431',
        primary: '#FF4500',
        slateBlue: '#313D4F',
        purple: "#7474e1"
    }
})

export default theme
