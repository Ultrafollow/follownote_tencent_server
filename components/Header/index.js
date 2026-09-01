import {Header} from './Header';
import WebAuth from './GitAuth';

export default function HeaderComponent() {
    return (
        <div className='relative flex-auto items-center justify-center sticky top-2 z-50 lg:top-3'>
            <Header>
                <WebAuth />
            </Header>
        </div>
    )
}