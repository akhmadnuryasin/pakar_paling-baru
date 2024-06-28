import { useEffect, useState } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/theme-switch';
import { Link } from 'react-router-dom';
import supabase from '@/supabaseClient';

interface Guru {
  id: number;
  nama: string;
}

export default function DaftarGuru() {
  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Konsultasi' },
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

  const [gurus, setGurus] = useState<Guru[]>([]);
  const [sort, setSort] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('pengguna')
        .select('id, nama')
        .eq('peran', 'guru');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setGurus(data);
      }
    };

    fetchData();
  }, []);

  const sortedGurus = [...gurus].sort((a, b) => {
    if (sort === 'ascending') {
      return a.nama.localeCompare(b.nama);
    } else {
      return b.nama.localeCompare(a.nama);
    }
  });

  const filteredGurus = sortedGurus.filter((guru) =>
    guru.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout fadedBelow fixedHeight>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>{items}</Breadcrumb>
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
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        <ul className='grid gap-4 pt-4 pb-16 overflow-y-scroll no-scrollbar md:grid-cols-2 lg:grid-cols-3'>
          {filteredGurus.map((guru) => (
            <li
              key={guru.id}
              className='flex flex-col p-4 border rounded-lg hover:shadow-md'
            >
              <div className='flex mx-auto mb-6 h-28 w-28'>
                <Avatar className='w-full h-full rounded-full '>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <h2 className='mb-1 font-semibold text-center'>{guru.nama}</h2>
              <p className='m-6 text-center'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
                deleniti, aliquid praesentium alias corrupti nihil. Expedita hic neque
                laudantium eum?
              </p>
              <Dialog>
                <a href='https://google.com' target='_blank' className='flex items-center justify-center py-1.5 hover:bg-slate-900 border rounded-full'>
                  Pilih
                </a>
              </Dialog>
            </li>
          ))}
        </ul>
      </LayoutBody>
    </Layout>
  );
}
