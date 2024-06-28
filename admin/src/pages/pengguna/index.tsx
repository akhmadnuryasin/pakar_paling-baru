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
import { Button } from '@/components/ui/button';
import { IconChecks, IconEdit, IconTrash, IconX } from '@tabler/icons-react';

export default function Pengguna() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user } = useAuth();
  const [newAnnouncement, setNewAnnouncement] = useState({ judul: '', isi: '' });
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          throw new Error('User is not authenticated.');
        }

        const { data, error } = await supabase
          .from('pengumuman')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setAnnouncements(data || []);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [user, newAnnouncement, editingAnnouncement]);

  useEffect(() => {
    filterAndSortAnnouncements();
  }, [announcements, searchTerm, sortOrder]);

  const filterAndSortAnnouncements = () => {
    let filtered = announcements;

    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.judul.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.judul.localeCompare(b.judul);
      } else {
        return b.judul.localeCompare(a.judul);
      }
    });

    setFilteredAnnouncements(sorted);
  };

  const handleAddAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('pengumuman')
        .insert([newAnnouncement]);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setAnnouncements([...announcements, ...data]);
      }

      setNewAnnouncement({ judul: '', isi: '' });
    } catch (error: any) {
      console.error('Error adding announcement:', error.message);
    }
  };

  const handleEditAnnouncement = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('pengumuman')
        .update(editingAnnouncement)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setAnnouncements(announcements.map(announcement => (announcement.id === id ? data[0] : announcement)));
      }

      setEditingAnnouncement(null);
    } catch (error: any) {
      console.error('Error editing announcement:', error.message);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pengumuman')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    } catch (error: any) {
      console.error('Error deleting announcement:', error.message);
    }
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Pengumuman' },
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
      {/* Top Heading */}
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>
            {items}
          </Breadcrumb>
          <ThemeSwitch />
        </div>
      </LayoutHeader>

      {/* Content */}
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
        {/* Add New Announcement Form */}
        <div className='my-4'>
          <h2 className='mb-4 text-lg font-medium'>Tambah Pengumuman</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Judul'
              value={newAnnouncement.judul}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, judul: e.target.value })}
            />
            <Input
              placeholder='Deskripsi'
              value={newAnnouncement.isi}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isi: e.target.value })}
            />
            <Button onClick={handleAddAnnouncement}>Tambah</Button>
          </div>
        </div>
        {/* Announcement Table */}
        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 pr-6 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Judul
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Deskripsi
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredAnnouncements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className='py-4 pr-6 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingAnnouncement?.id === announcement.id ? (
                    <Input
                      value={editingAnnouncement.judul}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, judul: e.target.value })}
                    />
                  ) : (
                    announcement.judul
                  )}
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingAnnouncement?.id === announcement.id ? (
                    <Input
                      value={editingAnnouncement.isi}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, isi: e.target.value })}
                    />
                  ) : (
                    announcement.isi
                  )}
                </TableCell>
                <TableCell className='flex justify-end px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingAnnouncement?.id === announcement.id ? (
                    <>
                      <Button variant='ghost' onClick={() => handleEditAnnouncement(announcement.id)}>
                        <IconChecks className='w-5 h-5' />
                      </Button>
                      <Button variant='ghost' onClick={() => setEditingAnnouncement(null)}>
                        <IconX className='w-5 h-5' />
                      </Button>
                    </>
                  ) : (
                    <div className='flex space-x-2'>
                      <Button
                        variant='ghost'
                        onClick={() => setEditingAnnouncement(announcement)}
                      >
                        <IconEdit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <IconTrash className='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}
