<?php
    class Validation {
        public static function validateCPF($cpf) {
            $cpf = preg_replace('/[^0-9]/', '', $cpf);

            if(strlen($cpf) != 11 || preg_match('/(\d)\1{10}/', $cpf)) {
                return false;
            }

            for($t = 9; $t < 11; $t++) {
                for($d = 0, $c = 0; $c < $t; $c++) {
                    $d += $cpf[$c] * (($t + 1) - $c);
                }
                $d = ((10 * $d) % 11) % 10;
                if($cpf[$c] != $d) {
                    return false;
                }
            }
            return true;
        }

        public static function validatePhone($phone) {
            return preg_match('/^(\+55)?\s?(\(\d{2}\)|\d{2})?\s?\d{4,5}-?\d{4}$/', $phone);
        }

        public static function validateDate($date, $format = 'Y-m-d') {
            $d = DateTime::createFromFormat($format, $date);
            return $d && $d->format($format) === $date;
        }
    }
?>