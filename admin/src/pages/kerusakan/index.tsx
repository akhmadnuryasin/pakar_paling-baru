import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout';
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Kerusakan() {
  const [kerusakanList, setKerusakanList] = useState([]);
  const [filteredKerusakan, setFilteredKerusakan] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingKerusakan, setEditingKerusakan] = useState(null);
  const [newKerusakan, setNewKerusakan] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortKerusakan();
  }, [kerusakanList, searchTerm, sortOrder]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/damage');
      setKerusakanList(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAndSortKerusakan(); // Trigger filter and sort when editingKerusakan changes
  }, [editingKerusakan]);

  const filterAndSortKerusakan = () => {
    let filtered = [...kerusakanList];

    if (searchTerm) {
      filtered = filtered.filter(kerusakan =>
        kerusakan.kerusakan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a.kode_kerusakan && b.kode_kerusakan) {
        return sortOrder === 'ascending' ? a.kode_kerusakan.localeCompare(b.kode_kerusakan) : b.kode_kerusakan.localeCompare(a.kode_kerusakan);
      } else {
        return 0;
      }
    });

    setFilteredKerusakan(sorted);
  };

  const handleDeleteKerusakan = async (id) => {
    try {
      await axios.delete(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/damage/${id}`);
      setKerusakanList(kerusakanList.filter(kerusakan => kerusakan.id !== id));
      filterAndSortKerusakan(); // Update filtered list after deletion
      toast('Kerusakan berhasil dihapus.', { type: 'success' });
    } catch (error) {
      console.error('Error deleting kerusakan:', error.message);
      toast('Terjadi kesalahan saat menghapus kerusakan.', { type: 'error' });
    }
  };

  const handleEditKerusakan = async () => {
    if (!editingKerusakan) return;
  
    try {
      const response = await axios.put(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/damage/${editingKerusakan.id}`, editingKerusakan);
      const updatedKerusakanList = kerusakanList.map(kerusakan => (kerusakan.id === response.data.id ? response.data : kerusakan));
      setKerusakanList(updatedKerusakanList);
      setEditingKerusakan(null);
      fetchData(); // Fetch updated data after edit
      toast('Kerusakan berhasil diubah.', { type: 'success' });
    } catch (error) {
      console.error('Error editing kerusakan:', error.message);
      toast('Terjadi kesalahan saat mengubah kerusakan.', { type: 'error' });
    }
  };
  
  const handleAddKerusakan = async () => {
    try {
      const response = await axios.post('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/damage', {
        kerusakan: newKerusakan,
      });
      const updatedKerusakanList = [...kerusakanList, response.data];
      setKerusakanList(updatedKerusakanList);
      setNewKerusakan('');
      fetchData(); // Fetch updated data after add
      toast('Kerusakan berhasil ditambahkan.', { type: 'success' });
    } catch (error) {
      console.error('Error adding kerusakan:', error.message);
      toast('Terjadi kesalahan saat menambah kerusakan.', { type: 'error' });
    }
  };

  const openEditForm = (kerusakan) => {
    setEditingKerusakan(kerusakan);
  };

  const closeEditForm = () => {
    setEditingKerusakan(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Kerusakan Kendaraan' },
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
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>{items}</Breadcrumb>
          <ThemeSwitch />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col pt-0' fixedHeight>
        <div className='flex items-end justify-between gap-4 my-4 sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 grow sm:my-4 sm:flex-row'>
            <Input
              placeholder='Search...'
              className='w-full h-9'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select
            value={sortOrder}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className='w-16'>
              <SelectValue>Sort</SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>Ascending</SelectItem>
              <SelectItem value='descending'>Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow' />
        <div className='my-4'>
          <h2 className='mb-4 text-lg font-medium'>Tambah Kerusakan</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Kerusakan'
              value={newKerusakan}
              onChange={(e) => setNewKerusakan(e.target.value)}
            />
            <Button onClick={handleAddKerusakan}>Tambah</Button>
          </div>
        </div>

        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='py-3 pr-6 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Kode Kerusakan
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Kerusakan
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredKerusakan.map(kerusakan => (
              <KerusakanRow
                key={kerusakan.id}
                kerusakan={kerusakan}
                editingKerusakan={editingKerusakan}
                onEdit={openEditForm}
                onDelete={handleDeleteKerusakan}
                onEditSave={handleEditKerusakan}
                onCancelEdit={closeEditForm}
              />
            ))}
          </TableBody>
        </Table>
      </LayoutBody>
    </Layout>
  );
}

function KerusakanRow({ kerusakan, editingKerusakan, onEdit, onDelete, onEditSave, onCancelEdit }) {
  const isEditing = editingKerusakan && editingKerusakan.id === kerusakan.id;

  const handleEdit = () => {
    onEdit(kerusakan);
  };

  const handleDelete = () => {
    onDelete(kerusakan.id);
  };

  const handleSave = async () => {
    try {
      await onEditSave();
    } catch (error) {
      console.error('Error saving kerusakan:', error.message);
    }
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <TableRow>
      <TableCell className='py-4 pr-6 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {kerusakan.kode_kerusakan}
      </TableCell>
      <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {isEditing ? (
          <Input
            value={editingKerusakan.kerusakan}
            onChange={(e) => onEdit({ ...editingKerusakan, kerusakan: e.target.value })}
          />
        ) : (
          kerusakan.kerusakan
        )}
      </TableCell>
      <TableCell className='flex justify-end px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
        {isEditing ? (
          <>
            <Button variant='ghost' onClick={handleSave}>
              Save
            </Button>
            <Button variant='ghost' onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant='ghost' onClick={handleEdit}>
              <IconEdit className='w-4 h-4' />
            </Button>
            <Button variant='ghost' onClick={handleDelete}>
              <IconTrash className='w-4 h-4' />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
