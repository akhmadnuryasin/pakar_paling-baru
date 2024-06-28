import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import { RecentSales } from './components/recent-sales';
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb';
import { Link } from 'react-router-dom';
import supabase from '@/supabaseClient';
import { useAuth } from '../../auth-context';

interface Announcement {
  id: number;
  judul: string;
  isi: string;
  dibuat_pada: string;
}

interface DashboardData {
  jumlahMatapelajaran: number;
  jumlahPengguna: number;
  jumlahTugas: number;
  jumlahPengumuman: number;
  pengumuman: Announcement[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    jumlahMatapelajaran: 0,
    jumlahPengguna: 0,
    jumlahTugas: 0,
    jumlahPengumuman: 0,
    pengumuman: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          throw new Error('User is not authenticated.');
        }

        // Fetch jumlah matapelajaran dari tabel kursus
        const { data: kursusData, error: kursusError } = await supabase
          .from('kursus')
          .select('id', { count: 'exact' });

        if (kursusError) {
          throw new Error(kursusError.message);
        }

        // Fetch jumlah pengguna dari tabel pengguna
        const { data: penggunaData, error: penggunaError } = await supabase
          .from('pengguna')
          .select('id', { count: 'exact' });

        if (penggunaError) {
          throw new Error(penggunaError.message);
        }

        // Fetch jumlah tugas dari tabel tugas
        const { data: tugasData, error: tugasError } = await supabase
          .from('tugas')
          .select('id', { count: 'exact' });

        if (tugasError) {
          throw new Error(tugasError.message);
        }

        // Fetch data pengumuman
        const { data: pengumumanData, error: pengumumanError } = await supabase
          .from('pengumuman')
          .select('*');

        if (pengumumanError) {
          throw new Error(pengumumanError.message);
        }

        // Update state dengan data yang diambil dari supabase
        setDashboardData({
          jumlahMatapelajaran: kursusData.length,
          jumlahPengguna: penggunaData.length,
          jumlahTugas: tugasData.length,
          jumlahPengumuman: pengumumanData.length,
          pengumuman: pengumumanData,
        });

      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const items = [
    { title: 'Dashboard', href: '/' },
    // Tambahkan breadcrumb items sesuai kebutuhan
  ].map(({ href, title }, index) => (
    <BreadcrumbItem key={index}>
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
    <Layout>
      {/* Top Heading */}
      <LayoutHeader>
        <div className='flex items-center justify-between w-full pl-2 space-x-4 lg:p-b- lg:ml-auto'>
          <Breadcrumb>{items}</Breadcrumb>
          <ThemeSwitch />
        </div>
      </LayoutHeader>

      {/* Main Content */}
      <LayoutBody className='pt-0 space-y-4'>
        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {/* Cards for various data */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Pelajaran
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.jumlahMatapelajaran}
                  </div>
                </CardContent>
              </Card>

              {/* Materi Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Pengguna
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.jumlahPengguna}
                  </div>
                </CardContent>
              </Card>

              {/* Tugas Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>Pengumuman</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData.jumlahPengumuman}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-8'>
                <CardHeader>
                  <CardTitle>Pengumuman</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <RecentSales data={dashboardData.pengumuman} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Dashboard;

