import { useEffect, useState } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconHourglassHigh,
  IconCircleCheck,
  IconExclamationCircle,
} from '@tabler/icons-react';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/theme-switch';
import { Link } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import supabase from '@/supabaseClient';

export default function Pengajuan() {
  const { toast } = useToast();
  const [apps, setApps] = useState<any[]>([]);
  const [sort, setSort] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('pengajuan_konsultasi')
          .select('id, topik, deskripsi, status, diajukan_pada') // Pastikan id juga terpilih untuk digunakan dalam fungsi delete
          .eq('id_siswa', 1) // Ganti dengan id siswa yang sesuai
          .order('diajukan_pada', { ascending: sort === 'ascending' });

        if (error) {
          throw new Error(error.message);
        }

        setApps(data || []);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [sort]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('pengajuan_konsultasi')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Remove the deleted item from the list
      setApps(apps.filter(app => app.id !== id));

      // Show a success notification
      toast({
        title: "Konsultasi Dibatalkan",
        description: `Berhasil Membatalkan Konsultasi`,
      });
    } catch (error: any) {
      console.error('Error deleting data:', error.message);
      // Optionally, show an error notification
    }
  };

  const items = [
    { title: 'Dashboard', href: '/' },
    { title: 'Pengajuan' },
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
        <ul className='grid gap-4 pt-4 pb-16 overflow-y-scroll no-scrollbar'>
          {apps.map((app) => (
            <Dialog key={app.id}>
              <DialogTrigger>
                <li className='p-4 border rounded-lg hover:shadow-md'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h2 className='mb-1 font-semibold text-start'>
                        {app.topik.charAt(0).toUpperCase() + app.topik.slice(1)}
                      </h2>
                      <p className='text-gray-500 text-start line-clamp-2'>{app.deskripsi}</p>
                    </div>
                    <div className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}>
                      {app.status === "pending" ? <IconHourglassHigh /> : app.status === "accepted" ? <IconCircleCheck /> : app.status === "rejected" ? <IconExclamationCircle /> : null}
                    </div>
                  </div>
                </li>
              </DialogTrigger>
              <DialogContent className='w-[90%] rounded-lg'>
                <DialogDescription>
                  <div>
                    <span className="font-bold">Perihal</span>{" "}
                    <span className="ml-6">
                      {app.topik.charAt(0).toUpperCase() + app.topik.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">Deskripsi</span>{" "}
                    <span className="ml-2">
                      {app.deskripsi.charAt(0).toUpperCase() + app.deskripsi.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">Tanggal</span>{" "}
                    <span className="ml-4">
                      {new Date(app.diajukan_pada).toISOString().split("T")[0]}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">Status</span>{" "}
                    <span className="ml-7">
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </DialogDescription>
                <Button onClick={() => {
                  handleDelete(app.id);
                }}>Batalkan Konsultasi</Button>
              </DialogContent>
            </Dialog>
          ))}
        </ul>
      </LayoutBody>
    </Layout>
  );
}
