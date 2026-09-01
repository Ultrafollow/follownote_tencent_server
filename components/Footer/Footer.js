import BuildWith from '@/components/Footer/BuildWith';
import { Container } from '@/components/ui/Container';

export default function Footer() {
  return (
    <Container as="div" className="mb-4 pt-2 lg:pt-8">
      <hr className='my-2'></hr>
      <footer>
        <div className="mb-8 mt-16 items-center justify-between space-y-4 md:mb-10 md:flex md:space-y-0">
          <BuildWith />
          <div className="my-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div>created in 2025</div>
            <span>{` • `}</span>
            <span>FollowXu's Blog</span>
          </div>
        </div>
      </footer>
    </Container>
  );
}
