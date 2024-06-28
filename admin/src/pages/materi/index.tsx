import { useEffect, useState } from 'react';
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout';
import { useAuth } from '../../auth-context';
import { Input } from '@/components/ui/input';
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

export default function Materi() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          throw new Error('User is not authenticated.');
        }
        const fetchTasksAndCourses = async () => {
          try {
            const { data: tasks, error: tasksError } = await supabase
              .from('pelajaran')
              .select('*');
            if (tasksError) {
              throw new Error(tasksError.message);
            }

            const { data: courses, error: coursesError } = await supabase
              .from('kursus')
              .select('id, judul');
            if (coursesError) {
              throw new Error(coursesError.message);
            }

            const tasksWithCourses = tasks.map(task => ({
              ...task,
              judul_kursus: courses.find(course => course.id === task.id_kursus)?.judul || 'Unknown Course',
            }));

            setTasks(tasksWithCourses);
          } catch (error: any) {
            console.error('Error fetching data:', error.message);
          }
        };

        fetchTasksAndCourses();
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchTerm, sortOrder]);

  const filterAndSortTasks = () => {
    const filtered = tasks.filter(task =>
      task.judul_kursus.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.judul_kursus.localeCompare(b.judul_kursus);
      } else {
        return b.judul_kursus.localeCompare(a.judul_kursus);
      }
    });

    setFilteredTasks(sorted);
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Materi' },
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
        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Materi
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Deskripsi
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Pelajaran
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {task.judul}
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {task.konten}
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {task.judul_kursus}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}
