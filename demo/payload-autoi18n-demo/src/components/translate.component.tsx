import React from "react";
import {useDocumentInfo, useLocale} from 'payload/components/utilities'
import payload from "payload";

const translateComponent: React.FC = () => {

    const { slug, id } = useDocumentInfo();
    const locale = useLocale();
    const baseUrl = 'http://localhost:3000/api';
    const translateFn = e => {
        console.log('foo')
        fetch(baseUrl + `/${slug}/${id}/translate?id=${id}&locale=${locale}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
        }).then( () => location.reload() ) // not the nicest way, but it is sufficient for a demo
    }

    return <a href="#" onClick={translateFn}>Translate</a>
}

export default translateComponent;
