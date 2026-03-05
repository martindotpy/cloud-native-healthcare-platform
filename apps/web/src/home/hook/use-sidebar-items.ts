import type { IconType } from "react-icons/lib"
import {
  TbCalendar,
  TbFileDescription,
  TbHeartRateMonitor,
  TbHome,
  TbMapPin,
  TbShield,
  TbStethoscope,
  TbUser,
} from "react-icons/tb"

// Hook
interface SidebarItem {
  to: string
  label: string
  icon: IconType
}

export function useSidebarItems(): SidebarItem[] {
  return [
    {
      to: "/",
      label: "Inicio",
      icon: TbHome,
    },
    {
      to: "/citas",
      label: "Citas",
      icon: TbCalendar,
    },
    {
      to: "/doctores",
      label: "Doctores",
      icon: TbStethoscope,
    },
    {
      to: "/especialidades",
      label: "Especialidades",
      icon: TbFileDescription,
    },
    {
      to: "/sedes",
      label: "Sedes",
      icon: TbMapPin,
    },
    {
      to: "/clientes",
      label: "Clientes",
      icon: TbUser,
    },
    {
      to: "/aseguradoras",
      label: "Aseguradoras",
      icon: TbShield,
    },
    {
      to: "/ehr",
      label: "EHR",
      icon: TbHeartRateMonitor,
    },
  ]
}
