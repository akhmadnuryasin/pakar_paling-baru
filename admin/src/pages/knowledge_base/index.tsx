import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
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
import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/theme-switch';
import { useToast } from "@/components/ui/use-toast"

interface Kerusakan {
  id: string;
  kode_kerusakan: string;
  kode_gejala: string;
  nilai_gejala: string;
}

interface NewEntry {
  kode_kerusakan: string;
  kode_gejala: string;
  nilai_gejala: string;
}

export default function Gejala() {
  const [kerusakanList, setKerusakanList] = useState<Kerusakan[]>([]);
  const [filteredKerusakan, setFilteredKerusakan] = useState<Kerusakan[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('ascending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingRows, setEditingRows] = useState<{ [key: string]: boolean }>({});
  const [originalData, setOriginalData] = useState<{ [key: string]: Kerusakan }>({});
  const [newEntry, setNewEntry] = useState<NewEntry>({
    kode_kerusakan: '',
    kode_gejala: '',
    nilai_gejala: '',
  });

  const { toast } = useToast()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Kerusakan[]>('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptomseverity');
      setKerusakanList(response.data || []);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error fetching data:', error.message);
      }
    }
  };

  useEffect(() => {
    const filterAndSortKerusakan = () => {
      let filtered = [...kerusakanList];

      if (searchTerm) {
        filtered = filtered.filter(kerusakan =>
          kerusakan.kode_gejala.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const sorted = [...filtered].sort((a, b) => {
        if (a.kode_gejala && b.kode_gejala) {
          return sortOrder === 'ascending' ? a.kode_gejala.localeCompare(b.kode_gejala) : b.kode_gejala.localeCompare(a.kode_gejala);
        } else {
          return 0;
        }
      });

      setFilteredKerusakan(sorted);
    };

    filterAndSortKerusakan();
  }, [kerusakanList, searchTerm, sortOrder]);

  const handleDeleteKerusakan = async (id: string) => {
    try {
      await axios.delete(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptomseverity/${id}`);
      setKerusakanList(kerusakanList.filter(kerusakan => kerusakan.id !== id));
      toast({
        title: "Sukses",
        description: "Nilai gejala berhasil dihapus.",
      })
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menghapus nilai gejala.",
        })
        // console.error('Error deleting kerusakan:', error.message);
      }
    }
  };

  const startEditing = (id: string, kerusakan: Kerusakan) => {
    setEditingRows(prevState => ({
      ...prevState,
      [id]: true,
    }));

    setOriginalData(prevState => ({
      ...prevState,
      [id]: { ...kerusakan },
    }));
  };

  const cancelEditing = (id: string) => {
    setEditingRows(prevState => ({
      ...prevState,
      [id]: false,
    }));

    if (originalData[id]) {
      const originalKerusakan = originalData[id];
      handleInputChange(originalKerusakan.kode_kerusakan, 'kode_kerusakan', id);
      handleInputChange(originalKerusakan.kode_gejala, 'kode_gejala', id);
      handleInputChange(originalKerusakan.nilai_gejala, 'nilai_gejala', id);
    }
  };

  const saveEditing = async (id: string, updatedData: Kerusakan) => {
    try {
      await axios.put(`https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptomseverity/${id}`, updatedData);
      setKerusakanList(kerusakanList.map(kerusakan => kerusakan.id === id ? updatedData : kerusakan));
      setEditingRows(prevState => ({
        ...prevState,
        [id]: false,
      }));
      setOriginalData(prevState => {
        const newState = { ...prevState };
        delete newState[id];
        return newState;
      });
      toast({
        title: "Sukses",
        description: "Nilai gejala berhasil diubah",
      })
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // console.error('Error updating kerusakan:', error.message);
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat mengubah nilai gejala.",
        })
      }
    }
  };

  const handleInputChange = (value: string, fieldName: keyof Kerusakan, id: string) => {
    const updatedKerusakanList = kerusakanList.map((kerusakan) => {
      if (kerusakan.id === id) {
        return {
          ...kerusakan,
          [fieldName]: value,
        };
      }
      return kerusakan;
    });
    setKerusakanList(updatedKerusakanList);
  };

  const handleNewInputChange = (value: string, fieldName: keyof NewEntry) => {
    setNewEntry(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const addNewEntry = async () => {
    try {
      await axios.post('https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/admin/symptomseverity', newEntry);
      await fetchData(); 
      setNewEntry({
        kode_kerusakan: '',
        kode_gejala: '',
        nilai_gejala: '',
      });
      toast({
        title: "Sukses",
        description: "Nilai gejala berhasil ditambahkan",
      })
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menambahkan nilai gejala.",
        })
        // console.error('Error adding new entry:', error.message);
      }
    }
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Nilai Gejala' },
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value)}
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
          <h2 className='px-2 mb-4 font-medium text-muted-foreground'>Tambah Nilai Gejala</h2>
          <div className='flex flex-col gap-2 lg:flex-row'>
            <Input
              placeholder='Kode Gejala'
              value={newEntry.kode_gejala}
              onChange={(e) => handleNewInputChange(e.target.value, 'kode_gejala')}
            />
            <Input
              placeholder='Nilai Gejala'
              value={newEntry.nilai_gejala}
              onChange={(e) => handleNewInputChange(e.target.value, 'nilai_gejala')}
            />
            <Button onClick={addNewEntry}>Tambah</Button>
          </div>
        </div>
        <Separator className='shadow' />
        <Table className='min-w-full bg-transparent rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Kode Gejala
              </TableHead>
              <TableHead className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase rounded-md'>
                Nilai Gejala
              </TableHead>
              <TableHead className='py-3 pr-12 text-xs font-medium tracking-wider text-right text-gray-500 uppercase rounded-md'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-transparent divide-y'>
            {filteredKerusakan.map((kerusakan) => (
              <TableRow key={kerusakan.id}>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {kerusakan.kode_gejala}
                </TableCell>
                <TableCell className='px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingRows[kerusakan.id] ? (
                    <Input
                      value={kerusakan.nilai_gejala}
                      onChange={(e) => handleInputChange(e.target.value, 'nilai_gejala', kerusakan.id)}
                    />
                  ) : (
                    kerusakan.nilai_gejala
                  )}
                </TableCell>
                <TableCell className='flex justify-end px-6 py-4 text-sm text-gray-500 rounded-md whitespace-nowrap'>
                  {editingRows[kerusakan.id] ? (
                    <>
                      <Button variant='ghost' onClick={() => saveEditing(kerusakan.id, kerusakan)}>
                        Save
                      </Button>
                      <Button variant='ghost' onClick={() => cancelEditing(kerusakan.id)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant='ghost' onClick={() => startEditing(kerusakan.id, kerusakan)}>
                        <IconEdit className='w-4 h-4' />
                      </Button>
                      <Button variant='ghost' onClick={() => handleDeleteKerusakan(kerusakan.id)}>
                        <IconTrash className='w-4 h-4' />
                      </Button>
                    </>
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
