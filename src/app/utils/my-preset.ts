import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset: unknown = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          0: '#ffffff',
          50: '{sky.50}',
          100: '{sky.100}',
          200: '{sky.200}',
          300: '{sky.300}',
          400: '{sky.400}',
          500: '{sky.500}',
          600: '{sky.600}',
          700: '{sky.700}',
          800: '{sky.800}',
          900: '{sky.900}',
          950: '{sky.950}',
        },
        surface: {
          950: '#ffffff',
          900: '{neutral.50}',
          800: '{neutral.100}',
          700: '{neutral.200}',
          600: '{neutral.300}',
          500: '{neutral.400}',
          400: '{neutral.500}',
          300: '{neutral.600}',
          200: '{neutral.700}',
          100: '{neutral.800}',
          50: '{neutral.900}',
          0: '{neutral.950}',
        },
      },
      dark: {
        primary: {
          0: '#ffffff',
          50: '{indigo.50}',
          100: '{indigo.100}',
          200: '{indigo.200}',
          300: '{indigo.300}',
          400: '{indigo.400}',
          500: '{indigo.500}',
          600: '{indigo.600}',
          700: '{indigo.700}',
          800: '{indigo.800}',
          900: '{indigo.900}',
          950: '{indigo.950}',
        },
        surface: {
          0: '#ffffff',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}',
        },
      },
    },
  },
});
