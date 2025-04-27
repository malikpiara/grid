'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import proj4 from 'proj4';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Define EPSG:20790

proj4.defs(
  'EPSG:20790',
  '+proj=tmerc +lat_0=39.66666666666666 +lon_0=-8.131906111111112 +k=1 +x_0=200000 +y_0=300000 +ellps=intl +towgs84=-304.046,-60.576,103.640,0,0,0,0 +units=m +no_defs'
);

const formSchema = z.object({
  x: z.coerce.number({
    message: 'Username must be at least 2 characters.',
    invalid_type_error: 'X coordinate must be a number',
  }),
  y: z.coerce.number({
    message: 'Username must be at least 2 characters.',
    invalid_type_error: 'Y coordinate must be a number',
  }),
});

export default function ProfileForm() {
  const [convertedCoords, setConvertedCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      x: undefined,
      y: undefined,
    },
  });

  const PRECISION = 15;

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { x, y } = values;

    // Convert strings to numbers if needed
    const xNum = Number(x);
    const yNum = Number(y);

    const [lon, lat] = proj4('EPSG:20790', 'EPSG:4326', [xNum, yNum]);

    setConvertedCoords({ lat, lon });

    window.open(
      `https://google.com/maps/place/${lat.toFixed(PRECISION)},${lon.toFixed(
        PRECISION
      )}`
    );
  }

  return (
    <div className='m-3.5'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <section className='flex gap-4'>
            <FormField
              control={form.control}
              name='x'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenada X</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='x' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='y'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenada Y</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='y' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Button type='submit' size={'lg'}>
            Obter Coordenadas
          </Button>

          {convertedCoords && (
            <div className='mt-4 p-4 bg-gray-100 rounded-md'>
              <h3 className='font-medium'>Coordenadas Convertidas:</h3>
              <p>Latitude: {convertedCoords.lat.toFixed(PRECISION)}</p>
              <p>Longitude: {convertedCoords.lon.toFixed(PRECISION)}</p>
              <p className='mt-2 text-sm text-gray-600'>
                Google Maps URL:
                <a
                  href={`https://google.com/maps/place/${convertedCoords.lat.toFixed(
                    PRECISION
                  )},${convertedCoords.lon.toFixed(PRECISION)}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-1 text-green-600 hover:underline'
                >
                  Abrir no Google Maps
                </a>
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
