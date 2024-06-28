import { useEffect, useState } from 'react';
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout';
import { useAuth } from '../../auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

export default function Komunitas() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newNamaKomunitas, setNewNamaKomunitas] = useState<string>('');
  const [newLinkGrup, setNewLinkGrup] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          throw new Error('User is not authenticated.');
        }
        const { data: courses, error } = await supabase
          .from('komunitas')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setCourses(courses || []);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, courses]);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchTerm, sortOrder]);

  const filterAndSortCourses = () => {
    if (!courses) return;

    const filtered = courses.filter(course =>
      course.nama_komunitas.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.nama_komunitas.localeCompare(b.nama_komunitas);
      } else {
        return b.nama_komunitas.localeCompare(a.nama_komunitas);
      }
    });

    setFilteredCourses(sorted);
  };

  const handleAddKomunitas = async () => {
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('komunitas')
        .insert([
          {
            nama_komunitas: newNamaKomunitas,
            link_grup: newLinkGrup,
            pembuat: user.email,
          }
        ]);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Refresh the list of courses
        setCourses((prevCourses) => [...prevCourses, ...data]);
      }

      setNewNamaKomunitas('');
      setNewLinkGrup('');
    } catch (error: any) {
      console.error('Error adding komunitas:', error.message);
    }
  };

  const handleDeleteKomunitas = async (id: string) => {
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }

    try {
      const { error } = await supabase
        .from('komunitas')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh the list of courses after deletion
      setCourses((prevCourses) => prevCourses.filter(course => course.id !== id));
    } catch (error: any) {
      console.error('Error deleting komunitas:', error.message);
    }
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Komunitas' },
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

        {/* Form for adding new community */}
        <div className='flex flex-col gap-4 mb-4'>
          <h3 className='text-lg font-semibold'>Tambah Komunitas Baru</h3>
          <Input
            placeholder='Nama Komunitas'
            className='w-full h-9'
            value={newNamaKomunitas}
            onChange={(e) => setNewNamaKomunitas(e.target.value)}
          />
          <Input
            placeholder='Link Grup WhatsApp'
            className='w-full h-9'
            value={newLinkGrup}
            onChange={(e) => setNewLinkGrup(e.target.value)}
          />
          <Button onClick={handleAddKomunitas}>Tambah Komunitas</Button>
        </div>

        <Separator className='shadow' />
        <ul className='grid gap-4 pt-4 pb-16 overflow-y-scroll no-scrollbar md:grid-cols-2 lg:grid-cols-3'>
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <li
                key={course.id}
                className='flex justify-between p-4 border rounded-lg hover:shadow-md'
              >
                <div>
                  <h2 className='mb-1 font-semibold'>{course.nama_komunitas}</h2>
                  <h2 className='mb-1 text-xs font-light'>By {course.pembuat}</h2>
                </div>
                <div className='flex items-center justify-end space-x-2'>
                  <a target='_blank' rel='noopener noreferrer' href={course.link_grup}>
                    <Button
                      variant='outline'
                      size='sm'
                    >
                      Gabung
                    </Button>
                  </a>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDeleteKomunitas(course.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Tidak ada komunitas yang ditemukan.</p>
          )}
        </ul>
      </LayoutBody>
    </Layout>
  );
}
