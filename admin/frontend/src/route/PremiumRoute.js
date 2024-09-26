import React from 'react'
const PremiumRoute = ({ component: Component, routeKey, ...props }) => {
    return <Component {...props} />
}

export default PremiumRoute
