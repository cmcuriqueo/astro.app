const checkIsNavigationSupported = () => {
    return Boolean(document.startViewTransition);
}

const fetchPage = async (url) => {
    //vamos a cargar el contenido de la pagina 
    //utilizando un fetch para obtener el html
    const response = await fetch(url);
    const html = await response.text();

    const [,data] = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return data;
}
export const startViewTransition = () => {

    if(!checkIsNavigationSupported() )return;
    
    window.navigation.addEventListener('navigate', (event) => {
        console.log(event.destination.url);
        const toUrl = new URL(event.destination.url);
        
        if(location.origin != toUrl.origin) return;

        event.intercept({
            async handler () {

                const data = await fetchPage(toUrl.pathname);
                document.startViewTransition(() => {
                    document.body.innerHTML = data;
                    document.documentElement.scrollTop = 0;
                })

            }
        }) 


    });
}	