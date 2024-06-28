import { useEffect, useState } from 'react';
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout';
import { useAuth } from '../../auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/theme-switch';
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import { Link } from 'react-router-dom';
import supabase from '@/supabaseClient';

export default function Elearning() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [searchTerm, setSearchTerm] = useState<string>(''); // Perbaiki tipe searchTerm menjadi string
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          throw new Error('User is not authenticated.');
        }
        const fetchCourses = async () => {
          try {
            const { data: courses, error } = await supabase
              .from('kursus')
              .select('*')
              .eq('id_guru', user.id);

            if (error) {
              throw new Error(error.message);
            }

            setCourses(courses || []);
          } catch (error: any) {
            console.error('Error fetching data:', error.message);
          }
        };

        fetchCourses();
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchTerm, sortOrder]);

  const filterAndSortCourses = () => {
    // Filter courses based on searchTerm
    const filtered = courses.filter(course =>
      course.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort filtered courses based on sortOrder
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.judul.localeCompare(b.judul);
      } else {
        return b.judul.localeCompare(a.judul);
      }
    });

    setFilteredCourses(sorted);
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'E-Learning' },
  ].map(({ href, title }) => (
    <BreadcrumbItem key={title}>
      {href ? (
        <Link
          className='font-medium text-muted-foreground decoration-muted-foreground decoration-dashed underline-offset-4 hover:text-foreground hover:decoration-solid'
          to={href}
        >
          {title}
        </Link>
      ) : (
        <span className='font-medium text-muted-foreground'>{title}</span>
      )}
    </BreadcrumbItem>
  ));

  return (
    <Layout fadedBelow fixedHeight>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>
            {items}
          </Breadcrumb>
          <ThemeSwitch />
        </div>
      </LayoutHeader>

      {/* ===== Content ===== */}
      <LayoutBody className='flex flex-col pt-0' fixedHeight>
        <div className='flex items-end justify-between gap-4 my-4 sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 grow sm:my-4 sm:flex-row'>
            <Input
              placeholder='Search...'
              className='w-full h-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={sortOrder} onValueChange={value => setSortOrder(value as 'ascending' | 'descending')}>
            <SelectTrigger className='w-16'>
              <SelectValue>Sort</SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                Ascending
              </SelectItem>
              <SelectItem value='descending'>
                Descending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        <ul className='grid gap-4 pt-4 pb-16 overflow-y-scroll no-scrollbar md:grid-cols-2 lg:grid-cols-3'>
          {filteredCourses.map((course) => (
            <li
              key={course.id}
              className='p-4 border rounded-lg hover:shadow-md'
            >
              <div>
                <h2 className='mb-1 font-semibold'>{course.judul}</h2>
              </div>
              <div className='flex justify-start mt-4 space-x-2'>
                <Link to={`/materi/${course.id}`}>
                  <Button
                    variant='outline'
                    size='sm'
                  >
                    Materi
                  </Button>
                </Link>
                <Link to={`/tugas/${course.id}`}>
                  <Button
                    variant='outline'
                    size='sm'
                  >
                    Tugas
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </LayoutBody>
    </Layout>
  );
}
